import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, LogOut } from "lucide-react";
import { authService } from "@/services/authService";
import { transactionService, Transaction } from "@/services/transactionService";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const MONTH_MAP: Record<string,string> = {
  January: "01",
  February: "02",
  March: "03",
  April: "04",
  May: "05",
  June: "06",
  July: "07",
  August: "08",
  September: "09",
  October: "10",
  November: "11",
  December: "12",
};

const MonthlyReportPage = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<"month" | "status">("month");
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[now.getMonth()]);
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  const handleBack = () => {
    navigate("/navigation");
  };

  useEffect(() => {
    // Load transactions from service
    setTransactions(transactionService.getTransactions());
  }, []);

  const filteredTransactions = (() => {
    if (filterType === "status") {
      return transactions.filter(
        (t) => selectedStatus === "All" || t.status === selectedStatus
      );
    }

    // month filter: map month name + year -> 'YYYY-MM'
    const mm = MONTH_MAP[selectedMonth] ?? "01";
    const monthKey = `${selectedYear}-${mm}`;
    return transactions.filter((t) => t.date.startsWith(monthKey));
  })();

  const calculateTotals = () => {
    const totalAmount = filteredTransactions.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0),
      0
    );
    const totalFuel = filteredTransactions.reduce(
      (sum, item) => sum + (parseFloat(item.fuelConsumption) || 0),
      0
    );
    const totalSubsidy = filteredTransactions.reduce(
      (sum, item) => sum + (parseFloat(item.subsidyLiters) || 0),
      0
    );

    return {
      totalAmount: totalAmount.toFixed(2),
      totalFuel: totalFuel.toFixed(2),
      totalSubsidy: totalSubsidy.toFixed(2),
    };
  };

  const totals = calculateTotals();

  // Build small list of years (current, -1, -2) for selection
  const currentYear = now.getFullYear();
  const yearOptions = [currentYear - 2, currentYear - 1, currentYear].map(String);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">N</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">NOCTS Admin Page</h1>
            </div>
          </div>
          <Button variant="destructive" size="lg" onClick={handleLogout}>
            <LogOut className="mr-2 h-5 w-5" />
            Log Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8">Monthly Report</h2>

          {/* Filter Controls */}
          <div className="flex gap-4 mb-6 items-center">
            <Select
              value={filterType}
              onValueChange={(value: "month" | "status") => setFilterType(value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Filter by Month</SelectItem>
                <SelectItem value="status">Filter by Status</SelectItem>
              </SelectContent>
            </Select>

            {filterType === "month" ? (
              <>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((y) => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            ) : (
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Eligible">Eligible</SelectItem>
                  <SelectItem value="Ineligible">Ineligible</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Report Table */}
          <Card className="bg-surface-elevated border-border">
            <CardHeader>
              <CardTitle className="text-foreground">
                {filterType === "month" ? `Monthly Report — ${selectedMonth} ${selectedYear}` : "Status Report"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-muted-foreground">
                      Transaction ID
                    </TableHead>
                    <TableHead className="text-muted-foreground">Name/ID</TableHead>
                    <TableHead className="text-muted-foreground">Amount (RM)</TableHead>
                    <TableHead className="text-muted-foreground">
                      Fuel Consumption (ℓ)
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Fuel Subsidy (ℓ)
                    </TableHead>
                    {filterType === "month" && (
                      <TableHead className="text-muted-foreground">Status</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={filterType === "month" ? 6 : 5}
                        className="text-center text-muted-foreground"
                      >
                        No transactions yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {filteredTransactions.map((row) => (
                        <TableRow key={row.transactionId}>
                          <TableCell className="text-foreground">
                            {row.transactionId}
                          </TableCell>
                          <TableCell className="text-foreground">
                            {row.nameId || "-"}
                          </TableCell>
                          <TableCell className="text-foreground">
                            {row.amount}
                          </TableCell>
                          <TableCell className="text-foreground">
                            {row.fuelConsumption}
                          </TableCell>
                          <TableCell className="text-foreground">
                            {row.subsidyLiters || "-"}
                          </TableCell>
                          {filterType === "month" && (
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded text-sm ${
                                  row.status === "Eligible"
                                    ? "bg-success/20 text-success"
                                    : "bg-destructive/20 text-destructive"
                                }`}
                              >
                                {row.status || "Unknown"}
                              </span>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50 font-medium">
                        <TableCell className="text-foreground">Total</TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-foreground">
                          RM {totals.totalAmount}
                        </TableCell>
                        <TableCell className="text-foreground">
                          {totals.totalFuel} ℓ
                        </TableCell>
                        <TableCell className="text-foreground">
                          {totals.totalSubsidy} ℓ
                        </TableCell>
                        {filterType === "month" && <TableCell></TableCell>}
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MonthlyReportPage;
