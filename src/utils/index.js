const capital = 3344.84;

// Added addOneDay function

export const formatISODate = (dateString) => {
  const date = new Date(dateString);

  // Get day of month (1-31)
  const day = date.getDate();

  // Add ordinal suffix (st, nd, rd, th)
  let suffix = "th";
  if (day % 10 === 1 && day !== 11) {
    suffix = "st";
  } else if (day % 10 === 2 && day !== 12) {
    suffix = "nd";
  } else if (day % 10 === 3 && day !== 13) {
    suffix = "rd";
  }

  // Format with weekday, month name, day with ordinal suffix, and year
  return date
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .replace(/\d+/, day + suffix);
};

export const addOneDay = (date) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + 1);
  return newDate;
};

export const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

export const calculateDayProfits = (
  capital,
  deposits = [],
  withdrawals = []
) => {
  let adjustedCapital = capital;

  // Process deposits in order of whenDeposited
  const sortedDeposits = deposits.sort(
    (a, b) => a.whenDeposited - b.whenDeposited
  );

  const sortedWithdrawals = withdrawals.sort(
    (a, b) => a.whenWithdraw - b.whenWithdraw
  );

  // Add deposits at different stages
  sortedDeposits.forEach((depositInfo) => {
    if (depositInfo.whenDeposited === 0) {
      adjustedCapital += depositInfo.amount;
    }
  });

  sortedWithdrawals.forEach((withdrawInfo) => {
    if (withdrawInfo.whenWithdraw === 0) {
      adjustedCapital -= withdrawInfo.amount;
    }
  });

  // First trade
  const firstTradeTotalAmount = adjustedCapital * 0.01;
  const firstTradeRemainingBalance = adjustedCapital - firstTradeTotalAmount;
  const firstTradeProfit = firstTradeTotalAmount * 0.88;
  const capitalAfterFirstTrade =
    firstTradeRemainingBalance + firstTradeTotalAmount + firstTradeProfit;

  let adjustedSecondBalance = capitalAfterFirstTrade;

  // Add deposits at different stages
  sortedDeposits.forEach((depositInfo) => {
    if (depositInfo.whenDeposited === 1) {
      adjustedSecondBalance += depositInfo.amount;
    }
  });

  sortedWithdrawals.forEach((withdrawInfo) => {
    if (withdrawInfo.whenWithdraw === 1) {
      adjustedSecondBalance -= withdrawInfo.amount;
    }
  });

  // Second trade
  const secondTradeTotalAmount = adjustedSecondBalance * 0.01;
  const secondTradeRemainingBalance =
    adjustedSecondBalance - secondTradeTotalAmount;
  const secondTradeProfit = secondTradeTotalAmount * 0.88;
  const capitalAfterSecondTrade =
    secondTradeRemainingBalance + secondTradeTotalAmount + secondTradeProfit;

  let adjustedThirdBalance = capitalAfterSecondTrade;

  // Add deposits at the second stage
  sortedDeposits.forEach((depositInfo) => {
    if (depositInfo.whenDeposited === 2) {
      adjustedThirdBalance += depositInfo.amount;
    }
  });

  sortedWithdrawals.forEach((withdrawInfo) => {
    if (withdrawInfo.whenWithdraw === 2) {
      adjustedThirdBalance -= withdrawInfo.amount;
    }
  });

  return {
    startingCapital: adjustedCapital,
    finalBalance: adjustedThirdBalance,
    totalProfit: secondTradeProfit + firstTradeProfit,
    deposits: sortedDeposits,
    firstTrade: {
      startingCapital: adjustedCapital,
      remainingBalance: firstTradeRemainingBalance,
      profit: firstTradeProfit,
      totalAmount: firstTradeTotalAmount,
      capitalAfterTrade: adjustedSecondBalance,
    },
    secondTrade: {
      startingCapital: adjustedSecondBalance,
      totalAmount: secondTradeTotalAmount,
      remainingBalance: secondTradeRemainingBalance,
      profit: secondTradeProfit,
      capitalAfterTrade: adjustedThirdBalance,
    },
  };
};

// export const generateWeeklyDays = (
//   capital,
//   date = new Date(),
//   deposits = [],
//   withdrawals = []
// ) => {
//   const today = new Date(date);
//   const currentDay = today.getDay(); // Get the current day index (0-6)
//   const daysFromSunday = currentDay; // How far today is from Sunday

//   const startOfWeek = new Date(today);
//   startOfWeek.setDate(today.getDate() - daysFromSunday); // Move back to Sunday

//   let runningCapital = capital;
//   let lastWeekEndDate;
//   let lastWeekFinalCapital;
//   let lastWeekStartingCapital;

//   // For tracking historical data between weeks
//   const weekStartDate = formatDate(startOfWeek);

//   const weekdays = [];

//   for (let i = 0; i < 7; i++) {
//     const day = new Date(startOfWeek);
//     day.setDate(startOfWeek.getDate() + i);

//     const currentDateString = formatDate(day);

//     // Find deposits and withdrawals for the current date
//     const depositInfo = deposits.filter((d) => d.date === currentDateString);
//     const withdrawInfo = withdrawals.filter(
//       (w) => w.date === currentDateString
//     );

//     const dayResult = calculateDayProfits(
//       runningCapital,
//       depositInfo,
//       withdrawInfo
//     );

//     runningCapital = dayResult.finalBalance;

//     weekdays.push({
//       ...dayResult,
//       date: currentDateString,
//       withdrawals: withdrawInfo,
//       deposits: depositInfo,
//     });
//   }

//   // Set the last week's end date (Saturday) and final capital
//   lastWeekEndDate = weekdays[6].date;
//   lastWeekStartingCapital = weekdays[0].startingCapital;
//   lastWeekFinalCapital = runningCapital;

//   // Calculate weekly totals
//   const totalFirstSignalProfit = weekdays.reduce(
//     (sum, day) => sum + (day.firstTrade?.profit || 0),
//     0
//   );
//   const totalSecondSignalProfit = weekdays.reduce(
//     (sum, day) => sum + (day.secondTrade?.profit || 0),
//     0
//   );
//   const totalSignalProfit = totalFirstSignalProfit + totalSecondSignalProfit;

//   // Calculate next week details
//   const nextWeekStartDate = new Date(lastWeekEndDate);
//   nextWeekStartDate.setDate(nextWeekStartDate.getDate() + 1);

//   const nextWeekEndDate = new Date(nextWeekStartDate);
//   nextWeekEndDate.setDate(nextWeekStartDate.getDate() + 6);

//   // Calculate previous week details
//   const prevWeekEndDate = new Date(startOfWeek);
//   prevWeekEndDate.setDate(prevWeekEndDate.getDate() - 1);

//   const prevWeekStartDate = new Date(prevWeekEndDate);
//   prevWeekStartDate.setDate(prevWeekEndDate.getDate() - 6);

//   return {
//     weekdays,
//     lastWeekEndDate,
//     lastWeekFinalCapital,
//     lastWeekStartingCapital,
//     startingCapital: capital,
//     totalDeposits: weekdays.reduce((sum, day) => sum + day.deposits.length, 0),
//     totalWithdrawals: weekdays.reduce(
//       (sum, day) => sum + day.withdrawals.length,
//       0
//     ),
//     deposits,
//     withdrawals,
//     totalSignalProfit,
//     totalFirstSignalProfit,
//     totalSecondSignalProfit,
//     // Add next week details
//     nextWeekDetails: {
//       nextWeekStartDate: formatDate(nextWeekStartDate),
//       nextWeekEndDate: formatDate(nextWeekEndDate),
//       nextWeekStartingCapital: lastWeekFinalCapital,
//     },
//     // Add previous week details
//     prevWeekDetails: {
//       prevWeekStartDate: formatDate(prevWeekStartDate),
//       prevWeekEndDate: formatDate(prevWeekEndDate),
//       prevWeekStartingCapital: 3900.0, // Default value or lookup from historical data
//     },
//     // Store the week's start date for reference
//     weekStartDate,
//   };
// };

export const generateWeeklyDays = (
  capital,
  date = new Date(),
  deposits = [],
  withdrawals = []
) => {
  const today = new Date(date);
  const currentDay = today.getDay(); // Get the current day index (0-6)
  const daysFromSunday = currentDay; // How far today is from Sunday

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - daysFromSunday); // Move back to Sunday

  let runningCapital = capital;
  let lastWeekEndDate;
  let lastWeekFinalCapital;
  let lastWeekStartingCapital;

  const weekdays = [];

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);

    const currentDateString = formatDate(day);

    // Find deposits and withdrawals for the current date
    const depositInfo = deposits.filter((d) => d.date === currentDateString);
    const withdrawInfo = withdrawals.filter(
      (w) => w.date === currentDateString
    );
    console.log(withdrawals);

    // Log deposits and withdrawals for debugging
    if (depositInfo.length > 0) {
      console.log(`Deposits on ${currentDateString}:`, depositInfo);
    }

    if (withdrawInfo.length > 0) {
      console.log(`Withdrawals on ${currentDateString}:`, withdrawInfo);
    }

    const dayResult = calculateDayProfits(
      runningCapital,
      depositInfo,
      withdrawInfo
    );

    runningCapital = dayResult.finalBalance;

    weekdays.push({
      ...dayResult,
      date: currentDateString,
      withdrawals: withdrawInfo,
      deposits: depositInfo,
    });
  }

  // Set the last week's end date (Saturday) and final capital
  lastWeekEndDate = weekdays[6].date;
  lastWeekStartingCapital = weekdays[0].startingCapital;
  lastWeekFinalCapital = runningCapital;

  // Calculate weekly totals
  const totalFirstSignalProfit = weekdays.reduce(
    (sum, day) => sum + (day.firstTrade?.profit || 0),
    0
  );
  const totalSecondSignalProfit = weekdays.reduce(
    (sum, day) => sum + (day.secondTrade?.profit || 0),
    0
  );
  const totalSignalProfit = totalFirstSignalProfit + totalSecondSignalProfit;

  return {
    weekdays,
    lastWeekEndDate,
    lastWeekFinalCapital,
    lastWeekStartingCapital,
    startingCapital: capital,
    totalDeposits: weekdays.reduce((sum, day) => sum + day.deposits.length, 0),
    totalWithdrawals: weekdays.reduce(
      (sum, day) => sum + day.withdrawals.length,
      0
    ),
    deposits,
    withdrawals,
    totalSignalProfit,
    totalFirstSignalProfit,
    totalSecondSignalProfit,
    weekStartDate: formatDate(startOfWeek),
  };
};

export const getNextWeekDays = (lastWeek, deposits, withdrawals) => {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7); // Move forward to next week

  return generateWeeklyDays(
    lastWeek.finalCapital,
    addOneDay(lastWeek.date),
    deposits,
    withdrawals
  );
};
