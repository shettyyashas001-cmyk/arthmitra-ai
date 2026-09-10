import React, { useState } from "react";
import {
  LayoutDashboard,
  ReceiptText,
  Sliders,
  PieChart as PieChartIcon,
  Bot,
  Users,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  AlertTriangle,
  Send,
  X,
} from "lucide-react";

interface Transaction {
  id: string;
  merchant: string;
  category: "Food" | "Travel" | "Books" | "Fun" | "Pocket Money";
  amount: number;
  type: "credit" | "debit";
  upiApp: "GPay" | "PhonePe" | "Paytm" | "Cash";
  date: string;
  flagged?: boolean;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "transactions" | "budget" | "analytics" | "copilot" | "parent"
  >("overview");

  // App State
  const [budgetLimit, setBudgetLimit] = useState<number>(12000);
  const [categoryLimits, setCategoryLimits] = useState({
    Food: 5000,
    Travel: 2500,
    Books: 1500,
    Fun: 2000,
  });

  const [parentAlerts, setParentAlerts] = useState({
    lowBalance: true,
    monthlyReport: true,
    largeExpense: false,
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "tx-1",
      merchant: "Campus Canteen UPI",
      category: "Food",
      amount: 120,
      type: "debit",
      upiApp: "GPay",
      date: "Today, 1:15 PM",
    },
    {
      id: "tx-2",
      merchant: "Metro Recharge",
      category: "Travel",
      amount: 250,
      type: "debit",
      upiApp: "PhonePe",
      date: "Yesterday, 6:30 PM",
    },
    {
      id: "tx-3",
      merchant: "Late Night Delivery",
      category: "Food",
      amount: 480,
      type: "debit",
      upiApp: "Paytm",
      date: "08 Sep, 11:20 PM",
      flagged: true,
    },
    {
      id: "tx-4",
      merchant: "Monthly Pocket Money",
      category: "Pocket Money",
      amount: 5000,
      type: "credit",
      upiApp: "GPay",
      date: "01 Sep, 10:00 AM",
    },
    {
      id: "tx-5",
      merchant: "College Bookstore",
      category: "Books",
      amount: 650,
      type: "debit",
      upiApp: "Cash",
      date: "05 Sep, 2:45 PM",
    },
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMerchant, setNewMerchant] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCategory, setNewCategory] = useState<"Food" | "Travel" | "Books" | "Fun">("Food");
  const [newUpiApp, setNewUpiApp] = useState<"GPay" | "PhonePe" | "Paytm" | "Cash">("GPay");

  // AI Chat State
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hey! I'm ArthMitra AI. 42% of your expenses this week were quick UPI payments under ₹100. How can I help you manage your allowance today?",
    },
  ]);

  // Calculated Metrics
  const totalSpent = transactions
    .filter((t) => t.type === "debit")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalInflow = transactions
    .filter((t) => t.type === "credit")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const safeDailySpend = Math.max(0, Math.round((budgetLimit - totalSpent) / 20));

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMerchant || !newAmount) return;

    const amountNum = parseFloat(newAmount);
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      merchant: newMerchant,
      category: newCategory,
      amount: amountNum,
      type: "debit",
      upiApp: newUpiApp,
      date: "Just now",
      flagged: amountNum > 400,
    };

    setTransactions([newTx, ...transactions]);
    setNewMerchant("");
    setNewAmount("");
    setIsModalOpen(false);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");

    setTimeout(() => {
      let reply = "Your overall budget is on track, but watch out for small canteen snacks!";
      if (userText.toLowerCase().includes("food") || userText.toLowerCase().includes("canteen")) {
        reply = "You have spent ₹850 on Food this week. Cooking or using campus mess for 2 days saves around ₹350.";
      } else if (userText.toLowerCase().includes("afford") || userText.toLowerCase().includes("movie")) {
        reply = "Checking your remaining safe spend limit (₹178/day)... You can afford it if you limit outings this weekend!";
      }
      setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    }, 500);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-3 px-2 py-4 mb-4">
            <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">
              ₹
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">ArthMitra AI</h1>
              <p className="text-xs text-slate-400">Student Budget Assistant</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              { id: "transactions", label: "Transactions & UPI", icon: ReceiptText },
              { id: "budget", label: "Budget Rules", icon: Sliders },
              { id: "analytics", label: "Analytics", icon: PieChartIcon },
              { id: "copilot", label: "AI Copilot", icon: Bot },
              { id: "parent", label: "Parent Connect", icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Student Profile Card */}
        <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-9 w-9 bg-indigo-600 rounded-full flex items-center justify-center font-semibold text-sm">
              YS
            </div>
            <div>
              <p className="text-sm font-medium text-white">Student Account</p>
              <p className="text-xs text-slate-400">Campus Wallet Active</p>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-700/60 flex justify-between text-xs text-slate-400">
            <span>Remaining Funds</span>
            <span className="text-emerald-400 font-semibold">₹{budgetLimit - totalSpent}</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900 capitalize">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "transactions" && "UPI & Cash Transactions"}
              {activeTab === "budget" && "Budget Limits & Thresholds"}
              {activeTab === "analytics" && "Spending Trends & Analytics"}
              {activeTab === "copilot" && "AI Financial Copilot"}
              {activeTab === "parent" && "Parent Connect Portal"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search transactions..."
                className="pl-9 pr-4 py-1.5 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border border-slate-200"
              />
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
            >
              <Plus size={16} />
              Add Transaction
            </button>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <>
              {/* Overspending Banner */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-amber-900">
                      Budget Warning: Food & Dining is at 85%
                    </h4>
                    <p className="text-xs text-amber-700">
                      You spent ₹{totalSpent} of your planned allowance with 20 days remaining.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("budget")}
                  className="text-xs font-semibold text-amber-800 bg-amber-200/60 hover:bg-amber-200 px-3 py-1.5 rounded-lg"
                >
                  Adjust Limit
                </button>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-medium text-slate-500">MONTHLY BUDGET</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">₹{budgetLimit}</p>
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (totalSpent / budgetLimit) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {Math.round((totalSpent / budgetLimit) * 100)}% utilized
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-medium text-slate-500">TOTAL SPENT SO FAR</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">₹{totalSpent}</p>
                  <p className="text-xs text-emerald-600 font-medium mt-3 flex items-center gap-1">
                    <ArrowDownLeft size={14} /> Total inflow: ₹{totalInflow}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-medium text-slate-500">SAFE DAILY SPEND</p>
                  <p className="text-2xl font-bold text-indigo-600 mt-1">₹{safeDailySpend}/day</p>
                  <p className="text-xs text-slate-500 mt-3">Calculated over remaining 20 days</p>
                </div>
              </div>

              {/* AI Copilot Card */}
              <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-5 rounded-xl text-white shadow-sm flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Bot size={16} className="text-indigo-400" />
                    <span className="text-xs font-semibold text-indigo-300">ArthMitra AI Copilot</span>
                  </div>
                  <p className="text-sm text-slate-200">
                    "You've had 4 UPI snack debits under ₹80 this week. Saving ₹300 can keep your weekend dining intact."
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("copilot")}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-xs font-medium rounded-lg text-white transition-colors"
                >
                  Chat with Copilot
                </button>
              </div>

              {/* Recent Transactions Preview */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900">Recent Transactions</h3>
                  <button
                    onClick={() => setActiveTab("transactions")}
                    className="text-xs font-semibold text-emerald-600 hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {transactions.slice(0, 4).map((tx) => (
                    <div key={tx.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                            tx.type === "credit"
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {tx.type === "credit" ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{tx.merchant}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span>{tx.category}</span>
                            <span>•</span>
                            <span className="font-medium text-slate-500">{tx.upiApp}</span>
                            <span>•</span>
                            <span>{tx.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-sm font-bold ${
                            tx.type === "credit" ? "text-emerald-600" : "text-slate-900"
                          }`}
                        >
                          {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                        </span>
                        {tx.flagged && (
                          <p className="text-[10px] text-amber-600 font-medium">Over limit</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: TRANSACTIONS */}
          {activeTab === "transactions" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-slate-900">All Transactions</h3>
                  <p className="text-xs text-slate-500">Live UPI payment feed and manual logs</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                >
                  + Add New Entry
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Merchant / Source</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Mode</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/60">
                        <td className="p-3.5 font-medium text-slate-900">{tx.merchant}</td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700 font-medium">
                            {tx.category}
                          </span>
                        </td>
                        <td className="p-3.5 text-xs text-slate-600 font-semibold">{tx.upiApp}</td>
                        <td className="p-3.5 text-xs text-slate-400">{tx.date}</td>
                        <td
                          className={`p-3.5 text-right font-bold ${
                            tx.type === "credit" ? "text-emerald-600" : "text-slate-900"
                          }`}
                        >
                          {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: BUDGET RULES */}
          {activeTab === "budget" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Monthly Budget Limits</h3>
                <p className="text-xs text-slate-500">
                  Set caps to trigger overspending and low-balance alerts
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 flex justify-between">
                    <span>Total Monthly Allowance</span>
                    <span className="text-emerald-600 font-bold">₹{budgetLimit}</span>
                  </label>
                  <input
                    type="range"
                    min="2000"
                    max="25000"
                    step="500"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(Number(e.target.value))}
                    className="w-full mt-2 accent-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  {(["Food", "Travel", "Books", "Fun"] as const).map((cat) => (
                    <div key={cat} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex justify-between text-sm font-semibold">
                        <span>{cat} Budget</span>
                        <span className="text-slate-900">₹{categoryLimits[cat]}</span>
                      </div>
                      <input
                        type="range"
                        min="500"
                        max="10000"
                        step="250"
                        value={categoryLimits[cat]}
                        onChange={(e) =>
                          setCategoryLimits({ ...categoryLimits, [cat]: Number(e.target.value) })
                        }
                        className="w-full mt-2 accent-emerald-600"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Category Spending Split</h3>
                <div className="space-y-3">
                  {[
                    { cat: "Food & Canteen", amount: 1850, pct: "52%", color: "bg-emerald-500" },
                    { cat: "Travel / Metro", amount: 650, pct: "18%", color: "bg-indigo-500" },
                    { cat: "Books & Study", amount: 450, pct: "13%", color: "bg-amber-500" },
                    { cat: "Entertainment", amount: 600, pct: "17%", color: "bg-rose-500" },
                  ].map((row) => (
                    <div key={row.cat}>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>{row.cat}</span>
                        <span>₹{row.amount} ({row.pct})</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className={`h-2 rounded-full ${row.color}`} style={{ width: row.pct }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Smart Insights</h3>
                  <ul className="text-xs text-slate-600 space-y-2 mt-4">
                    <li className="p-3 bg-emerald-50 rounded-lg text-emerald-800">
                      ✓ Daily spend is 14% lower than last week.
                    </li>
                    <li className="p-3 bg-amber-50 rounded-lg text-amber-800">
                      ⚠ Small UPI debits (under ₹50) total ₹420 this week.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AI COPILOT */}
          {activeTab === "copilot" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-[520px] flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                <Bot className="text-indigo-600" size={20} />
                <h3 className="text-sm font-bold text-slate-900">ArthMitra AI Advisor</h3>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-md p-3 rounded-xl text-sm ${
                        m.sender === "user"
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="p-3 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask e.g. 'Can I afford dining out this weekend?'"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: PARENT CONNECT */}
          {activeTab === "parent" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Parent Transparency & Safety Net</h3>
                <p className="text-xs text-slate-500">
                  Control which alerts and summary notifications can be sent to guardians
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    key: "lowBalance",
                    title: "Emergency Low-Balance SOS",
                    desc: "Notify parents automatically if wallet drops below ₹300",
                  },
                  {
                    key: "monthlyReport",
                    title: "High-Level Monthly Report",
                    desc: "Shares broad category percentages only (keeps item details private)",
                  },
                  {
                    key: "largeExpense",
                    title: "Large Single Expense Flag",
                    desc: "Notify if a single transaction exceeds ₹2,000",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={(parentAlerts as any)[item.key]}
                      onChange={() =>
                        setParentAlerts({
                          ...parentAlerts,
                          [item.key]: !(parentAlerts as any)[item.key],
                        })
                      }
                      className="h-4 w-4 accent-emerald-600 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl relative border border-slate-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-4">Add New Transaction</h3>

            <form onSubmit={handleAddTransaction} className="space-y-3.5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Merchant / Purpose
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Canteen Chai & Samosa"
                  value={newMerchant}
                  onChange={(e) => setNewMerchant(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 60"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                    <option value="Books">Books</option>
                    <option value="Fun">Fun</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Mode</label>
                  <select
                    value={newUpiApp}
                    onChange={(e) => setNewUpiApp(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="GPay">GPay (UPI)</option>
                    <option value="PhonePe">PhonePe (UPI)</option>
                    <option value="Paytm">Paytm (UPI)</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs mt-4 transition-colors"
              >
                Log Transaction
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}