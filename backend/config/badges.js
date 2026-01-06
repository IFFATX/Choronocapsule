// Badge definitions with requirements
export const BADGES = {
  FIRST_TIMER: {
    id: 'first_timer',
    name: 'First Timer',
    description: 'Created your first capsule',
    icon: '🎯',
    requirement: 'Create 1 capsule'
  },
  STARTER_PACK: {
    id: 'starter_pack',
    name: 'Starter Pack',
    description: 'Created 3 capsules',
    icon: '📦',
    requirement: 'Create 3 capsules'
  },
  MEMORY_KEEPER: {
    id: 'memory_keeper',
    name: 'Memory Keeper',
    description: 'Created 3 capsules',
    icon: '🏆',
    requirement: 'Create 3 capsules'
  },
  UNLOCKED_FIRST: {
    id: 'unlocked_first',
    name: 'Unlocked!',
    description: 'Unlocked your first capsule',
    icon: '🔓',
    requirement: 'Unlock 1 capsule'
  },
  PATIENT_ONE: {
    id: 'patient_one',
    name: 'Patient Soul',
    description: 'Created a capsule for 30+ days in the future',
    icon: '🧘',
    requirement: 'Set 30+ days unlock date'
  },
  YEAR_WARRIOR: {
    id: 'year_warrior',
    name: 'Year Warrior',
    description: 'Created a capsule for 1+ year in the future',
    icon: '🗓️',
    requirement: 'Set 1+ year unlock date'
  },
  TIME_TRAVELER: {
    id: 'time_traveler',
    name: 'Time Traveler',
    description: 'Created a capsule for 10+ years in the future',
    icon: '⏰',
    requirement: 'Set 10+ years unlock date'
  },
  FUTURE_MASTER: {
    id: 'future_master',
    name: 'Future Master',
    description: 'Created a capsule for 30+ years in the future',
    icon: '🚀',
    requirement: 'Set 30+ years unlock date'
  },
  DAILY_CREATOR: {
    id: 'daily_creator',
    name: 'On Fire',
    description: 'Created 3 capsules in one day',
    icon: '🔥',
    requirement: 'Create 3 in one day'
  }
};

// Function to check which badges a user has earned
export const checkBadges = (userStats) => {
  const earnedBadges = [];
  
  // First Timer - 1 capsule
  if (userStats.totalCapsules >= 1) {
    earnedBadges.push(BADGES.FIRST_TIMER.id);
  }
  
  // Starter Pack - 3 capsules
  if (userStats.totalCapsules >= 3) {
    earnedBadges.push(BADGES.STARTER_PACK.id);
  }
  
  // Memory Keeper - 3 capsules (same as starter, keeping both for backward compatibility)
  if (userStats.totalCapsules >= 3) {
    earnedBadges.push(BADGES.MEMORY_KEEPER.id);
  }
  
  // Unlocked First - 1 released capsule
  if (userStats.releasedCapsules >= 1) {
    earnedBadges.push(BADGES.UNLOCKED_FIRST.id);
  }
  
  // Patient Soul - created capsule for 30+ days
  if (userStats.longestFutureWaitDays >= 30) {
    earnedBadges.push(BADGES.PATIENT_ONE.id);
  }
  
  // Year Warrior - created capsule for 1+ year
  if (userStats.longestFutureWaitDays >= 365) {
    earnedBadges.push(BADGES.YEAR_WARRIOR.id);
  }
  
  // Time Traveler - created capsule for 10+ years
  if (userStats.longestFutureWaitDays >= 3650) {
    earnedBadges.push(BADGES.TIME_TRAVELER.id);
  }
  
  // Future Master - created capsule for 30+ years
  if (userStats.longestFutureWaitDays >= 10950) {
    earnedBadges.push(BADGES.FUTURE_MASTER.id);
  }
  
  // Daily Creator - 3 in one day
  if (userStats.maxCapsulesInOneDay >= 3) {
    earnedBadges.push(BADGES.DAILY_CREATOR.id);
  }
  
  return earnedBadges;
};

export default BADGES;
