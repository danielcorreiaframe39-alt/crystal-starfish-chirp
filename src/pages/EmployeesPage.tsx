import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Users, UserPlus, Mail } from "lucide-react";

type EmployeeStatus = "Ativo" | "Onboarding" | "Alerta";

type Employee = {
  id: number;
  name: string;
  email: string;
  role: string;
  tribe: string;
  status: EmployeeStatus;
  sentiment: number;
  lastPulse: string;
};

const initialEmployees: Employee[] = [
  {
    id: 1,
    name: "Alice Santos",
    email: "alice@crystal.dev",
    role: "Product Designer",
    tribe: "Discovery",
    status: "Ativo",
    sentiment: 92,
    lastPulse: "ha 2 dias",
  },
  {
    id: 2,
    name: "Bruno Campos",
    email: "bruno@crystal.dev",
    role: "Tech Lead",
    tribe: "Infra",
    status: "Alerta",
    sentiment: 58,
    lastPulse: "ha 6 dias",
  },
  {
    id: 3,
    name: "Camila Duarte",
    email: "camila@crystal.dev",
    role: "People Partner",
    tribe: "People Ops",
    status: "Onboarding",
    sentiment: 74,
    lastPulse: "ontem",
  },
  {
    id: 4,
    name: "Diego Nunes",
    email: "diego@crystal.dev",
    role: "Sales Strategist",
    tribe: "Growth",
    status: "Ativo",
    sentiment: 88,
    lastPulse: "ha 4 dias",
  },
];

const statusColor: Record<EmployeeStatus, string> = {
  Ativo: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Onboarding: "bg-blue-100 text-blue-700 border-blue-200",
  Alerta: "bg-amber-100 text-amber-700 border-amber-200",
};

const roles = [
  "Product Designer",
  "Tech Lead",
  "People Partner",
  "Sales Strategist",
  "Data Analyst",
];

const EmployeesPage = () => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | "Todos">(
    "Todos",
  );
  const [tabValue, setTabValue] = useState<"todos" | "ativos" | "onboarding">(
    "todos",
  );
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    role: roles[0],
    tribe: "Innovation",
  });

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.tribe.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "Todos" || employee.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [employees, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const onboarding = employees.filter(
      (employee) => employee.status === "Onboarding",
    ).length;
    const alert = employees.filter(
      (employee) => employee.status === "Alerta",
    ).length;
    const sentimentAverage = Math.round(
      employees.reduce((acc, curr) => acc + curr.sentiment, 0) /
        employees.length,
    );

    return {
      total: employees.length,
      onboarding,
      alert,
      sentimentAverage,
    };
  }, [employees]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newEmployee.name.trim() || !newEmployee.email.trim()) {
      return;
    }

    const nextId =
      employees.length > 0
        ? Math.max(...employees.map((employee) => employee.id)) + 1
        : 1;
    const created: Employee = {
      id: nextId,
      name: newEmployee.name,
      email: newEmployee.email,
      role: newEmployee.role,
      tribe: newEmployee.tribe,
      status: "Onboarding",
      sentiment: 75,
      lastPulse: "agora",
    };

    setEmployees([created, ...employees]);
    setNewEmployee({
      name: "",
      email: "",
      role: roles[0],
      tribe: "Innovation",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
            Pessoas & cultura
          </p>
          <h1 className="text-3xl font-semibold">Equipe e onboarding ativo</h1>
          <p className="text-muted-foreground">
            Acompanhe status, sentimento e convites da Crystal Starfish.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Buscar por nome, email ou tribe"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="min-w-[240px]"
          />
          <Select
            value={statusFilter}
            onValueChange={(value: EmployeeStatus | "Todos") =>
              setStatusFilter(value)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrar status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Ativo">Ativos</SelectItem>
              <SelectItem value="Onboarding">Onboarding</SelectItem>
              <SelectItem value="Alerta">Alerta</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total ativo</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.onboarding} em onboarding
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sentimento</CardTitle>
            <Sparkles className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sentimentAverage}%</div>
            <p className="text-xs text-muted-foreground">
              Media das ultimas pulses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Onboarding</CardTitle>
            <UserPlus className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.onboarding}</div>
            <p className="text-xs text-muted-foreground">
              Proximo welcome kit terca
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas</CardTitle>
            <Mail className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.alert}</div>
            <p className="text-xs text-muted-foreground">
              Pulse personalizada sugerida
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="order-2 lg:order-1">
          <CardHeader>
            <CardTitle>Cadastro rapido</CardTitle>
            <CardDescription>
              Convide alguem para um onboarding guiado pelo Crystal Starfish.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4 sm:grid-cols-2"
              onSubmit={handleSubmit}
            >
              <div className="sm:col-span-2">
                <Input
                  placeholder="Nome completo"
                  value={newEmployee.name}
                  onChange={(event) =>
                    setNewEmployee((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  type="email"
                  placeholder="Email corporativo"
                  value={newEmployee.email}
                  onChange={(event) =>
                    setNewEmployee((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <Select
                value={newEmployee.role}
                onValueChange={(value) =>
                  setNewEmployee((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Funcao" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Tribo / Squad"
                value={newEmployee.tribe}
                onChange={(event) =>
                  setNewEmployee((prev) => ({
                    ...prev,
                    tribe: event.target.value,
                  }))
                }
              />
              <Button type="submit" className="sm:col-span-2">
                Enviar convite inteligente
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card className="order-1 lg:order-2">
          <CardHeader>
            <CardTitle>Rituais sugeridos</CardTitle>
            <CardDescription>
              Baseado nos ultimos sinais culturais captados.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-2xl border border-primary/20 p-4">
              <p className="text-sm font-semibold">Welcome remoto</p>
              <p className="text-sm text-muted-foreground">
                Entregue trilhas personalizadas para os novos talentos.
              </p>
            </div>
            <div className="rounded-2xl border border-primary/20 p-4">
              <p className="text-sm font-semibold">Storytelling squad</p>
              <p className="text-sm text-muted-foreground">
                Compartilhe aprendizados de customer success quinzenalmente.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Matriz de colaboradores</CardTitle>
              <CardDescription>
                Dados consolidados de sentimento, status e ultima pulse.
              </CardDescription>
            </div>
            <Tabs
              value={tabValue}
              onValueChange={(value) => {
                const tab = value as "todos" | "ativos" | "onboarding";
                setTabValue(tab);
                const tabMap: Record<
                  typeof tab,
                  EmployeeStatus | "Todos"
                > = {
                  todos: "Todos",
                  ativos: "Ativo",
                  onboarding: "Onboarding",
                };
                setStatusFilter(tabMap[tab]);
              }}
            >
              <TabsList>
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="ativos">Ativos</TabsTrigger>
                <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
              </TabsList>
              <TabsContent value="todos" />
              <TabsContent value="ativos" />
              <TabsContent value="onboarding" />
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Funcao</TableHead>
                <TableHead>Tribo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sentimento</TableHead>
                <TableHead className="text-right">Ultima pulse</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="border bg-primary/10">
                        <AvatarFallback>
                          {employee.name
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p>{employee.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {employee.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>{employee.tribe}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusColor[employee.status]}
                    >
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{employee.sentiment}%</TableCell>
                  <TableCell className="text-right">
                    {employee.lastPulse}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredEmployees.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Nenhum colaborador com esse filtro. Ajuste os criterios para ver
              outros resultados.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesPage;
