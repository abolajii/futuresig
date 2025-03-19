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

export const generateYearlyData = () => {
  const startDate = "2024-03-18";
  const startingCapital = 4390;
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

// export const generateMonthData = (
//   startDate,
//   startingCapital,
//   deposits = [],
//   withdrawals = []
// ) => {
//   // Extract year and month from the start date
//   const startDateTime = new Date(startDate);
//   const year = startDateTime.getFullYear();
//   const month = startDateTime.getMonth();
//   const startDay = startDateTime.getDate();

//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const firstDayOfMonth = new Date(year, month, 1).getDay();

//   let days = [];
//   let monthlyTotalProfit = 0;
//   let monthlyDeposits = 0;
//   let monthlyWithdrawals = 0;
//   let runningCapital = startingCapital;

//   // Add days from previous month to fill calendar grid
//   const prevMonthDays = new Date(year, month, 0).getDate();
//   for (let i = 0; i < firstDayOfMonth; i++) {
//     days.push({
//       day: prevMonthDays - (firstDayOfMonth - i) + 1,
//       isCurrentMonth: false,
//       profit: 0,
//       deposit: 0,
//       withdraw: 0,
//     });
//   }

//   // Add days for current month with calculated profits
//   for (let i = 1; i <= daysInMonth; i++) {
//     const currentDate = new Date(year, month, i);
//     const dateString = formatDate(currentDate);

//     // Initialize day data
//     const dayData = {
//       day: i,
//       isCurrentMonth: true,
//       profit: 0,
//       deposit: 0,
//       withdraw: 0,
//       totalProfit: 0,
//       details: null,
//     };

//     // Only process days on or after the start date
//     if (i >= startDay) {
//       // Find deposits and withdrawals for the current date
//       const dayDeposits = deposits.filter((d) => d.date === dateString);
//       const dayWithdrawals = withdrawals.filter((w) => w.date === dateString);

//       const dayTotalDeposit = dayDeposits.reduce((sum, d) => sum + d.amount, 0);
//       const dayTotalWithdraw = dayWithdrawals.reduce(
//         (sum, w) => sum + w.amount,
//         0
//       );

//       // Update monthly totals
//       monthlyDeposits += dayTotalDeposit;
//       monthlyWithdrawals += dayTotalWithdraw;

//       // Calculate profits using the calculation function
//       const dayResult = calculateDayProfits(
//         runningCapital,
//         dayDeposits,
//         dayWithdrawals
//       );
//       runningCapital = dayResult.finalBalance;

//       const dayProfit = dayResult.totalProfit;
//       monthlyTotalProfit += dayProfit;

//       // Update day data with calculated values
//       dayData.profit = dayProfit;
//       dayData.deposit = dayTotalDeposit;
//       dayData.withdraw = dayTotalWithdraw;
//       dayData.totalProfit = dayProfit;
//       dayData.details = dayResult;
//     }

//     days.push(dayData);
//   }

//   // Add days from next month to fill remaining grid
//   const totalDaysNeeded = 42; // 6 rows of 7 days
//   const remainingCells = totalDaysNeeded - days.length;
//   for (let i = 1; i <= remainingCells; i++) {
//     days.push({
//       day: i,
//       isCurrentMonth: false,
//       profit: 0,
//       deposit: 0,
//       withdraw: 0,
//     });
//   }

//   return {
//     days,
//     summary: {
//       total: runningCapital,
//       profit: monthlyTotalProfit,
//       deposit: monthlyDeposits,
//       withdraw: monthlyWithdrawals,
//       startingCapital: startingCapital,
//       endingCapital: runningCapital,
//     },
//     runningCapital: runningCapital,
//   };
// };

export const generateMonthData = (
  startDate,
  startingCapital,
  deposits = [],
  withdrawals = []
) => {
  // Extract year and month from the start date
  const startDateTime = new Date(startDate);
  const year = startDateTime.getFullYear();
  const month = startDateTime.getMonth();

  // Handle different start dates based on initial month vs later months
  const startDay = month === 2 && year === 2025 ? 18 : 1; // If March 2025, start from the 18th, otherwise start from the 1st

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  let days = [];
  let monthlyTotalProfit = 0;
  let monthlyDeposits = 0;
  let monthlyWithdrawals = 0;
  let runningCapital = startingCapital;

  // Add days from previous month to fill calendar grid
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push({
      day: prevMonthDays - (firstDayOfMonth - i) + 1,
      isCurrentMonth: false,
      profit: 0,
      deposit: 0,
      withdraw: 0,
    });
  }

  // Add days for current month with calculated profits
  for (let i = 1; i <= daysInMonth; i++) {
    const currentDate = new Date(year, month, i);
    const dateString = formatDate(currentDate);

    // Initialize day data
    const dayData = {
      day: i,
      isCurrentMonth: true,
      profit: 0,
      deposit: 0,
      withdraw: 0,
      totalProfit: 0,
      details: null,
    };

    // Only process days on or after the start date
    if (i >= startDay) {
      // Find deposits and withdrawals for the current date
      const dayDeposits = deposits.filter((d) => d.date === dateString);
      const dayWithdrawals = withdrawals.filter((w) => w.date === dateString);

      const dayTotalDeposit = dayDeposits.reduce((sum, d) => sum + d.amount, 0);
      const dayTotalWithdraw = dayWithdrawals.reduce(
        (sum, w) => sum + w.amount,
        0
      );

      // Update monthly totals
      monthlyDeposits += dayTotalDeposit;
      monthlyWithdrawals += dayTotalWithdraw;

      // Calculate profits using the calculation function
      const dayResult = calculateDayProfits(
        runningCapital,
        dayDeposits.map((d) => ({ ...d, whenDeposited: d.whenDeposited || 0 })),
        dayWithdrawals.map((w) => ({ ...w, whenWithdraw: w.whenWithdraw || 0 }))
      );

      runningCapital = dayResult.finalBalance;

      const dayProfit = dayResult.totalProfit;
      monthlyTotalProfit += dayProfit;

      // Update day data with calculated values
      dayData.profit = dayProfit;
      dayData.deposit = dayTotalDeposit;
      dayData.withdraw = dayTotalWithdraw;
      dayData.totalProfit = dayProfit;
      dayData.details = dayResult;
    }

    days.push(dayData);
  }

  // Add days from next month to fill remaining grid
  const totalDaysNeeded = 42; // 6 rows of 7 days
  const remainingCells = totalDaysNeeded - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      profit: 0,
      deposit: 0,
      withdraw: 0,
    });
  }

  return {
    days,
    summary: {
      total: runningCapital,
      profit: monthlyTotalProfit,
      deposit: monthlyDeposits,
      withdraw: monthlyWithdrawals,
      startingCapital: startingCapital,
      endingCapital: runningCapital,
    },
    runningCapital: runningCapital,
  };
};
