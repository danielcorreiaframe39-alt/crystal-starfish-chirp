import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ClipboardCheck, CalendarClock, Zap, Sparkles } from "lucide-react";

type QuizStatus = "Publicado" | "Rascunho";

type Quiz = {
  id: number;
  title: string;
  focus: string;
  traits: string[];
  status: QuizStatus;
  completions: number;
  satisfaction: number;
  updatedAt: string;
};

const initialQuizzes: Quiz[] = [
  {
    id: 1,
    title: "Onboarding Imersivo",
    focus: "Integracao",
    traits: ["Empatia Pragmatica", "Entrega Continua"],
    status: "Publicado",
    completions: 128,
    satisfaction: 91,
    updatedAt: "ha 2 dias",
  },
  {
    id: 2,
    title: "Playbook de Feedback",
    focus: "Desenvolvimento",
    traits: ["Curadoria Radical"],
    status: "Publicado",
    completions: 86,
    satisfaction: 84,
    updatedAt: "ha 5 dias",
  },
  {
    id: 3,
    title: "Radar de Liderancas",
    focus: "Lideranca",
    traits: ["Pensamento Modular", "Entrega Continua"],
    status: "Rascunho",
    completions: 0,
    satisfaction: 0,
    updatedAt: "ontem",
  },
];

const availableTraits = [
  "Empatia Pragmatica",
  "Pensamento Modular",
  "Entrega Continua",
  "Curadoria Radical",
];

const statusStyles: Record<QuizStatus, string> = {
  Publicado: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Rascunho: "bg-amber-100 text-amber-700 border-amber-200",
};

const QuizzesPage = () => {
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [statusFilter, setStatusFilter] = useState<QuizStatus | "Todos">(
    "Todos",
  );
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: "",
    focus: "Integracao",
    description: "",
  });

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(
      (quiz) => statusFilter === "Todos" || quiz.status === statusFilter,
    );
  }, [quizzes, statusFilter]);

  const stats = useMemo(() => {
    const published = quizzes.filter((quiz) => quiz.status === "Publicado");
    const publishedCount = published.length;
    const drafts = quizzes.length - publishedCount;
    const completionAverage = published.length
      ? Math.round(
          published.reduce((acc, curr) => acc + curr.satisfaction, 0) /
            published.length,
        )
      : 0;

    return { publishedCount, drafts, completionAverage };
  }, [quizzes]);

  const toggleTrait = (trait: string) => {
    setSelectedTraits((prev) =>
      prev.includes(trait)
        ? prev.filter((item) => item !== trait)
        : [...prev, trait],
    );
  };

  const handleCreateQuiz = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !selectedTraits.length)
      return;

    const nextId =
      quizzes.length > 0 ? Math.max(...quizzes.map((quiz) => quiz.id)) + 1 : 1;
    setQuizzes([
      {
        id: nextId,
        title: form.title,
        focus: form.focus,
        traits: selectedTraits,
        status: "Rascunho",
        completions: 0,
        satisfaction: 0,
        updatedAt: "agora",
      },
      ...quizzes,
    ]);
    setForm({ title: "", focus: form.focus, description: "" });
    setSelectedTraits([]);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
            Quizzes inteligentes
          </p>
          <h1 className="text-3xl font-semibold">
            Conteudos conectados aos traits certos
          </h1>
          <p className="text-muted-foreground">
            Ative experiencias imersivas e receba sinais em tempo real.
          </p>
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value: QuizStatus | "Todos") =>
            setStatusFilter(value)
          }
        >
          <SelectTrigger className="w-full lg:w-[220px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos</SelectItem>
            <SelectItem value="Publicado">Publicados</SelectItem>
            <SelectItem value="Rascunho">Rascunhos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicados</CardTitle>
            <ClipboardCheck className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedCount}</div>
            <p className="text-xs text-muted-foreground">
              Prontos para os squads
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rascunhos</CardTitle>
            <CalendarClock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.drafts}</div>
            <p className="text-xs text-muted-foreground">
              Com analise pendente
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfacao media</CardTitle>
            <Zap className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionAverage}%</div>
            <p className="text-xs text-muted-foreground">
              Baseado nas ultimas 4 semanas
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Novo quiz guiado</CardTitle>
            <CardDescription>
              Combine traits estrategicos e personalize cada jornada.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleCreateQuiz}>
              <Input
                placeholder="Nome do quiz"
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, title: event.target.value }))
                }
                required
              />
              <Textarea
                placeholder="O que esse quiz pretende revelar?"
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                rows={3}
                required
              />
              <Select
                value={form.focus}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, focus: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Foco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Integracao">Integracao</SelectItem>
                  <SelectItem value="Desenvolvimento">Desenvolvimento</SelectItem>
                  <SelectItem value="Lideranca">Lideranca</SelectItem>
                  <SelectItem value="Cultura">Cultura</SelectItem>
                </SelectContent>
              </Select>
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  Traits vinculados ({selectedTraits.length})
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {availableTraits.map((trait) => (
                    <label
                      key={trait}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm transition",
                        selectedTraits.includes(trait)
                          ? "border-primary bg-primary/10"
                          : "hover:border-primary/40",
                      )}
                    >
                      <Checkbox
                        checked={selectedTraits.includes(trait)}
                        onCheckedChange={() => toggleTrait(trait)}
                        className="size-4 rounded border border-primary data-[state=checked]:bg-primary"
                      />
                      {trait}
                    </label>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full">
                Criar rascunho inteligente
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quizzes ativos</CardTitle>
            <CardDescription>
              Status, traits associados e satisfacao dos participantes.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quiz</TableHead>
                  <TableHead>Foco</TableHead>
                  <TableHead>Traits</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Satisfacao</TableHead>
                  <TableHead className="text-right">Atualizado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium">{quiz.title}</TableCell>
                    <TableCell>{quiz.focus}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {quiz.traits.map((trait) => (
                          <Badge key={trait} variant="secondary">
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusStyles[quiz.status]}
                      >
                        {quiz.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="min-w-[160px]">
                      {quiz.status === "Publicado" ? (
                        <div className="flex items-center gap-2">
                          <Progress value={quiz.satisfaction} className="flex-1" />
                          <span className="text-sm font-semibold">
                            {quiz.satisfaction}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Aguardando publicacao
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{quiz.updatedAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredQuizzes.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nenhum quiz com esse status.
              </p>
            )}
          </CardContent>
        </Card>
      </section>
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="size-4 text-primary" />
            Sugestao Crystal Starfish
          </CardTitle>
          <CardDescription>
            Detectamos alto interesse em jornadas de cultura para squads de
            Produto. Considere publicar um quiz focado em tomada de decisao
            colaborativa.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default QuizzesPage;
