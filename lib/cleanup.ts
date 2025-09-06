// Utility functions for cleaning up localStorage data

import { getRoot, updateRoot } from './localStore'

/**
 * Remove all symptom tracking data from localStorage
 */
export function removeSymptomData(): boolean {
  try {
    const root = getRoot()
    
    if (root.symptoms) {
      updateRoot(prev => {
        const newRoot = { ...prev }
        delete newRoot.symptoms
        return newRoot
      })
      return true
    }
    
    return false
  } catch (error) {
    console.error('Failed to remove symptom data:', error)
    return false
  }
}

/**
 * Clean up any unused or old data structures
 */
export function cleanupOldData(): { cleaned: boolean; itemsRemoved: string[] } {
  try {
    const root = getRoot()
    const itemsRemoved: string[] = []
    let needsUpdate = false

    // Remove symptoms data
    if (root.symptoms) {
      itemsRemoved.push(`${root.symptoms.length} symptom entries`)
      needsUpdate = true
    }

    if (needsUpdate) {
      updateRoot(prev => {
        const newRoot = { ...prev }
        delete newRoot.symptoms
        return newRoot
      })
    }

    return { cleaned: needsUpdate, itemsRemoved }
  } catch (error) {
    console.error('Failed to cleanup old data:', error)
    return { cleaned: false, itemsRemoved: [] }
  }
}

/**
 * Reset localStorage to clean state (keeps users, groups, members but removes tracking data)
 */
export function resetToCleanState(): boolean {
  try {
    const root = getRoot()
    
    updateRoot(prev => ({
      users: prev.users,
      groups: prev.groups,
      members: prev.members,
      tasks: prev.tasks,
      signups: prev.signups,
      updates: prev.updates,
      donations: prev.donations,
      invites: prev.invites,
      mailbox: prev.mailbox,
      session: prev.session,
      meta: prev.meta
      // Explicitly exclude symptoms
    }))

    return true
  } catch (error) {
    console.error('Failed to reset to clean state:', error)
    return false
  }
}
