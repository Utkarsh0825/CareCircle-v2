import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { WEBSITE_FEATURES, getContextualHelp, getQuickActions, findRelevantFeatures } from '@/lib/website-knowledge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file.' },
        { status: 500 }
      )
    }

    const { message, conversationHistory, currentPath } = await request.json()

    // Get contextual help and relevant features
    const contextualHelp = getContextualHelp(currentPath || '/dashboard')
    const relevantFeatures = findRelevantFeatures(message)
    const quickActions = getQuickActions(message)

    // Create a comprehensive system prompt for cancer support with website knowledge
    const systemPrompt = `You are CareBot, a compassionate AI assistant designed to help cancer patients and their caregivers navigate their care journey and the CareCircle app.

CURRENT CONTEXT:
- User is currently on: ${currentPath || '/dashboard'}
- Contextual help: ${contextualHelp}

AVAILABLE WEBSITE FEATURES:
${WEBSITE_FEATURES.map(f => `- ${f.name}: ${f.description} (${f.path})`).join('\n')}

Your role is to:
- Provide emotional support and encouragement
- Help users navigate and use the CareCircle app effectively
- Suggest relevant app features based on user needs
- Help organize and coordinate care tasks
- Suggest practical tips for managing daily life during treatment
- Remind users about important health practices
- Help coordinate with their support circle
- Provide general information about cancer care (with disclaimers)
- Guide users to the right pages and features in the app

NAVIGATION ASSISTANCE:
- When users ask about app features, guide them to the right pages
- Suggest quick actions and navigation options
- Help users understand what each part of the app does
- Provide step-by-step guidance for complex tasks

IMPORTANT GUIDELINES:
- ALWAYS remind users to consult healthcare professionals for medical advice
- Never diagnose or suggest treatments
- Focus on practical support, emotional well-being, and care coordination
- Be empathetic, patient, and understanding
- Use simple, clear language
- Encourage users to reach out to their support network
- Suggest using the CareCircle app features for better organization
- When users ask about app functionality, provide specific guidance and navigation help

Remember: You are a support tool, not a replacement for professional medical care.`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory.map((msg: any) => ({
          role: msg.role,
          content: msg.content
        })),
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that request. Please try again."

    return NextResponse.json({ 
      response,
      quickActions: quickActions.slice(0, 5), // Limit to 5 quick actions
      relevantFeatures: relevantFeatures.slice(0, 3), // Limit to 3 relevant features
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('ChatBot API Error:', error)
    return NextResponse.json(
      { error: 'Failed to get response from CareBot' },
      { status: 500 }
    )
  }
}
