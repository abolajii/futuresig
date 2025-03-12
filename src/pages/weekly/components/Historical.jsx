import React, { useState, useEffect } from "react";
import {
  BarChart2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  TrendingUp,
  Activity,
  DollarSign,
  Calendar as CalendarIcon,
} from "react-feather";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  BarChart,
  Legend,
} from "recharts";

const HistoricalDashboard = ({ historicalWeeks, formatAmount }) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [chartData, setChartData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [timeframe, setTimeframe] = useState("weekly");

  useEffect(() => {
    // Process historical data for charts
    if (historicalWeeks) {
      const chartArray = Object.keys(historicalWeeks).map((key) => {
        const weekData = historicalWeeks[key];
        return {
          week: formatDateShort(new Date(weekData.weekStartDate)),
          capital: weekData.startingCapital,
          finalCapital: weekData.finalCapital,
          growth: (
            (weekData.finalCapital / weekData.startingCapital - 1) *
            100
          ).toFixed(2),
        };
      });

      // Sort by date
      chartArray.sort(
        (a, b) => new Date(a.weekStartDate) - new Date(b.weekStartDate)
      );
      setChartData(chartArray);

      // Calculate performance metrics
      const performances = chartArray.map((week) => ({
        week: week.week,
        performance: parseFloat(week.growth),
      }));
      setPerformanceData(performances);
    }
  }, [historicalWeeks]);

  const formatDateShort = (date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Calculate overall performance stats
  const calculateStats = () => {
    if (!chartData || chartData.length === 0)
      return { average: 0, best: 0, worst: 0 };

    const performances = chartData.map((item) => parseFloat(item.growth));
    const average =
      performances.reduce((sum, val) => sum + val, 0) / performances.length;
    const best = Math.max(...performances);
    const worst = Math.min(...performances);

    return { average, best, worst };
  };

  const stats = calculateStats();

  // Calculate signal performance consistency
  const calculateSignalConsistency = () => {
    if (!historicalWeeks) return { signal1: 0, signal2: 0 };

    const weeks = Object.values(historicalWeeks);
    const signal1Positive = weeks.filter(
      (week) => week.totalFirstSignalProfit > 0
    ).length;
    const signal2Positive = weeks.filter(
      (week) => week.totalSecondSignalProfit > 0
    ).length;

    return {
      signal1: ((signal1Positive / weeks.length) * 100).toFixed(1),
      signal2: ((signal2Positive / weeks.length) * 100).toFixed(1),
    };
  };

  const consistency = calculateSignalConsistency();

  return (
    <div className="bg-gray-900 rounded-lg p-6 flex flex-col w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BarChart2 size={20} />
          Historical Performance
        </h2>

        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded ${
              timeframe === "weekly" ? "bg-blue-600" : "bg-gray-800"
            }`}
            onClick={() => setTimeframe("weekly")}
          >
            Weekly
          </button>
          <button
            className={`px-3 py-1 rounded ${
              timeframe === "monthly" ? "bg-blue-600" : "bg-gray-800"
            }`}
            onClick={() => setTimeframe("monthly")}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="flex mb-4 border-b border-gray-700">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "summary"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("summary")}
        >
          Summary
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "charts"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("charts")}
        >
          Charts
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "signals"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("signals")}
        >
          Signal Analysis
        </button>
      </div>

      {activeTab === "summary" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <Activity size={18} />
              Performance Overview
            </h3>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-700 rounded p-3 text-center">
                <div className="text-gray-400 text-sm">Average</div>
                <div
                  className={`text-lg font-bold ${
                    stats.average >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {stats.average.toFixed(2)}%
                </div>
              </div>

              <div className="bg-gray-700 rounded p-3 text-center">
                <div className="text-gray-400 text-sm">Best Week</div>
                <div className="text-lg font-bold text-green-400">
                  {stats.best.toFixed(2)}%
                </div>
              </div>

              <div className="bg-gray-700 rounded p-3 text-center">
                <div className="text-gray-400 text-sm">Worst Week</div>
                <div className="text-lg font-bold text-red-400">
                  {stats.worst.toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="mt-4">
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="week" tick={{ fill: "#ccc" }} />
                  <YAxis
                    tickFormatter={(tick) => `${tick}%`}
                    tick={{ fill: "#ccc" }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Performance"]}
                    contentStyle={{
                      backgroundColor: "#2d3748",
                      borderColor: "#4a5568",
                    }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="performance"
                    stroke="#4ade80"
                    strokeWidth={2}
                    dot={{ fill: "#4ade80", r: 4 }}
                    activeDot={{ r: 6, fill: "#4ade80" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <DollarSign size={18} />
              Capital Growth
            </h3>

            <div className="flex justify-between mb-4">
              <div>
                <div className="text-gray-400 text-sm">Starting Capital</div>
                <div className="text-lg font-semibold">
                  {chartData.length > 0
                    ? formatAmount(chartData[0].capital)
                    : formatAmount(0)}
                </div>
              </div>

              <div>
                <div className="text-gray-400 text-sm">Current Capital</div>
                <div className="text-lg font-semibold">
                  {chartData.length > 0
                    ? formatAmount(chartData[chartData.length - 1].finalCapital)
                    : formatAmount(0)}
                </div>
              </div>

              <div>
                <div className="text-gray-400 text-sm">Total Growth</div>
                <div
                  className={`text-lg font-bold ${
                    chartData.length > 0 &&
                    chartData[0].capital <
                      chartData[chartData.length - 1].finalCapital
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {chartData.length > 0
                    ? `${(
                        (chartData[chartData.length - 1].finalCapital /
                          chartData[0].capital -
                          1) *
                        100
                      ).toFixed(2)}%`
                    : "0.00%"}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="week" tick={{ fill: "#ccc" }} />
                  <YAxis tick={{ fill: "#ccc" }} />
                  <Tooltip
                    formatter={(value) => [formatAmount(value), "Capital"]}
                    contentStyle={{
                      backgroundColor: "#2d3748",
                      borderColor: "#4a5568",
                    }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Bar
                    dataKey="finalCapital"
                    fill="#4c6ef5"
                    name="Final Balance"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 md:col-span-2">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <CalendarIcon size={18} />
              Weekly Performance History
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-700">
                    <th className="py-2 px-4">Week</th>
                    <th className="py-2 px-4">Starting Balance</th>
                    <th className="py-2 px-4">Final Balance</th>
                    <th className="py-2 px-4">Signal 1 Profit</th>
                    <th className="py-2 px-4">Signal 2 Profit</th>
                    <th className="py-2 px-4">Total Profit</th>
                    <th className="py-2 px-4">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(historicalWeeks || {}).map((weekKey, index) => {
                    const week = historicalWeeks[weekKey];
                    const startDate = new Date(week.weekStartDate);
                    const endDate = new Date(week.weekEndDate);
                    const weekRange = `${formatDateShort(
                      startDate
                    )} - ${formatDateShort(endDate)}`;
                    const performance = (
                      (week.finalCapital / week.startingCapital - 1) *
                      100
                    ).toFixed(2);

                    // These are estimates since we don't have full historical signal data
                    const signal1Profit = week.totalFirstSignalProfit || 0;
                    const signal2Profit = week.totalSecondSignalProfit || 0;
                    const totalProfit = signal1Profit + signal2Profit;

                    return (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0 ? "bg-gray-700 bg-opacity-30" : ""
                        }
                      >
                        <td className="py-2 px-4">{weekRange}</td>
                        <td className="py-2 px-4">
                          {formatAmount(week.startingCapital)}
                        </td>
                        <td className="py-2 px-4">
                          {formatAmount(week.finalCapital)}
                        </td>
                        <td className="py-2 px-4 text-green-400">
                          {formatAmount(signal1Profit)}
                        </td>
                        <td className="py-2 px-4 text-green-400">
                          {formatAmount(signal2Profit)}
                        </td>
                        <td className="py-2 px-4 text-green-400">
                          {formatAmount(totalProfit)}
                        </td>
                        <td
                          className={`py-2 px-4 font-medium ${
                            parseFloat(performance) >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {performance}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "charts" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3">
              Capital Growth Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="week" tick={{ fill: "#ccc" }} />
                <YAxis tick={{ fill: "#ccc" }} />
                <Tooltip
                  formatter={(value) => [formatAmount(value), "Capital"]}
                  contentStyle={{
                    backgroundColor: "#2d3748",
                    borderColor: "#4a5568",
                  }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="finalCapital"
                  stroke="#4c6ef5"
                  name="Final Balance"
                  strokeWidth={2}
                  dot={{ fill: "#4c6ef5", r: 4 }}
                  activeDot={{ r: 6, fill: "#4c6ef5" }}
                />
                <Line
                  type="monotone"
                  dataKey="capital"
                  stroke="#a78bfa"
                  name="Starting Balance"
                  strokeWidth={2}
                  dot={{ fill: "#a78bfa", r: 4 }}
                  activeDot={{ r: 6, fill: "#a78bfa" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3">Weekly Performance (%)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="week" tick={{ fill: "#ccc" }} />
                <YAxis
                  tickFormatter={(tick) => `${tick}%`}
                  tick={{ fill: "#ccc" }}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Performance"]}
                  contentStyle={{
                    backgroundColor: "#2d3748",
                    borderColor: "#4a5568",
                  }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Bar
                  dataKey="performance"
                  name="Weekly Performance"
                  fill={(data) =>
                    data.performance >= 0 ? "#4ade80" : "#ef4444"
                  }
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 md:col-span-2">
            <h3 className="text-lg font-medium mb-3">
              Cumulative Growth Analysis
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={chartData.map((item, index, arr) => {
                  // Calculate cumulative growth from starting point
                  let cumulativeGrowth = 1;
                  for (let i = 0; i <= index; i++) {
                    cumulativeGrowth *= 1 + parseFloat(arr[i].growth) / 100;
                  }

                  return {
                    ...item,
                    cumulativeGrowth: ((cumulativeGrowth - 1) * 100).toFixed(2),
                  };
                })}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="week" tick={{ fill: "#ccc" }} />
                <YAxis
                  tickFormatter={(tick) => `${tick}%`}
                  tick={{ fill: "#ccc" }}
                  domain={["dataMin", "dataMax"]}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Cumulative Growth"]}
                  contentStyle={{
                    backgroundColor: "#2d3748",
                    borderColor: "#4a5568",
                  }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Line
                  type="monotone"
                  dataKey="cumulativeGrowth"
                  stroke="#10b981"
                  name="Cumulative Growth"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 4 }}
                  activeDot={{ r: 6, fill: "#10b981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === "signals" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3">
              Signal Performance Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={Object.keys(historicalWeeks || {}).map((weekKey) => {
                  const week = historicalWeeks[weekKey];
                  return {
                    week: formatDateShort(new Date(week.weekStartDate)),
                    signal1: week.totalFirstSignalProfit || 0,
                    signal2: week.totalSecondSignalProfit || 0,
                  };
                })}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="week" tick={{ fill: "#ccc" }} />
                <YAxis tick={{ fill: "#ccc" }} />
                <Tooltip
                  formatter={(value) => [formatAmount(value), ""]}
                  contentStyle={{
                    backgroundColor: "#2d3748",
                    borderColor: "#4a5568",
                  }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Legend />
                <Bar dataKey="signal1" fill="#4ade80" name="Signal 1 Profit" />
                <Bar dataKey="signal2" fill="#60a5fa" name="Signal 2 Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3">Signal Consistency</h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-lg mb-2">Signal 1 Success Rate</div>
                <div className="flex items-end">
                  <span className="text-3xl font-bold text-green-400">
                    {consistency.signal1}%
                  </span>
                  <span className="text-gray-400 ml-2 mb-1">
                    profitable weeks
                  </span>
                </div>
                <div className="mt-4 w-full bg-gray-600 rounded-full h-4">
                  <div
                    className="bg-green-400 h-4 rounded-full"
                    style={{ width: `${consistency.signal1}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-lg mb-2">Signal 2 Success Rate</div>
                <div className="flex items-end">
                  <span className="text-3xl font-bold text-blue-400">
                    {consistency.signal2}%
                  </span>
                  <span className="text-gray-400 ml-2 mb-1">
                    profitable weeks
                  </span>
                </div>
                <div className="mt-4 w-full bg-gray-600 rounded-full h-4">
                  <div
                    className="bg-blue-400 h-4 rounded-full"
                    style={{ width: `${consistency.signal2}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-medium mb-3">
                Signal Contribution to Profit
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Tooltip
                    formatter={(value) => [formatAmount(value), ""]}
                    contentStyle={{
                      backgroundColor: "#2d3748",
                      borderColor: "#4a5568",
                    }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Pie
                    data={[
                      {
                        name: "Signal 1",
                        value: Object.values(historicalWeeks || {}).reduce(
                          (sum, week) =>
                            sum + (week.totalFirstSignalProfit || 0),
                          0
                        ),
                      },
                      {
                        name: "Signal 2",
                        value: Object.values(historicalWeeks || {}).reduce(
                          (sum, week) =>
                            sum + (week.totalSecondSignalProfit || 0),
                          0
                        ),
                      },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#4ade80" />
                    <Cell fill="#60a5fa" />
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 md:col-span-2">
            <h3 className="text-lg font-medium mb-3">Weekly Signal Analysis</h3>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-700">
                    <th className="py-2 px-4">Week</th>
                    <th className="py-2 px-4">Signal 1 Profit</th>
                    <th className="py-2 px-4">Signal 2 Profit</th>
                    <th className="py-2 px-4">Most Profitable</th>
                    <th className="py-2 px-4">Contribution Ratio</th>
                    <th className="py-2 px-4">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(historicalWeeks || {}).map((weekKey, index) => {
                    const week = historicalWeeks[weekKey];
                    const startDate = new Date(week.weekStartDate);
                    const endDate = new Date(week.weekEndDate);
                    const weekRange = `${formatDateShort(
                      startDate
                    )} - ${formatDateShort(endDate)}`;

                    const signal1Profit = week.totalFirstSignalProfit || 0;
                    const signal2Profit = week.totalSecondSignalProfit || 0;
                    const mostProfitable =
                      signal1Profit > signal2Profit ? "Signal 1" : "Signal 2";

                    const totalProfit = signal1Profit + signal2Profit;
                    const signal1Ratio =
                      totalProfit === 0
                        ? 0
                        : ((signal1Profit / totalProfit) * 100).toFixed(1);
                    const signal2Ratio =
                      totalProfit === 0
                        ? 0
                        : ((signal2Profit / totalProfit) * 100).toFixed(1);
                    const ratio = `${signal1Ratio}% / ${signal2Ratio}%`;

                    // Add some analysis notes
                    let notes = "";
                    if (signal1Profit <= 0 && signal2Profit <= 0) {
                      notes = "Both signals unprofitable";
                    } else if (signal1Profit > 0 && signal2Profit > 0) {
                      notes = "Strong week with both signals profitable";
                    } else {
                      notes = `Only ${
                        signal1Profit > 0 ? "Signal 1" : "Signal 2"
                      } was profitable`;
                    }

                    return (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0 ? "bg-gray-700 bg-opacity-30" : ""
                        }
                      >
                        <td className="py-2 px-4">{weekRange}</td>
                        <td
                          className={`py-2 px-4 ${
                            signal1Profit >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {formatAmount(signal1Profit)}
                        </td>
                        <td
                          className={`py-2 px-4 ${
                            signal2Profit >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {formatAmount(signal2Profit)}
                        </td>
                        <td className="py-2 px-4">
                          {totalProfit === 0 ? (
                            "None"
                          ) : (
                            <span
                              className={
                                mostProfitable === "Signal 1"
                                  ? "text-green-400"
                                  : "text-blue-400"
                              }
                            >
                              {mostProfitable}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-4">{ratio}</td>
                        <td className="py-2 px-4 text-gray-300">{notes}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoricalDashboard;
