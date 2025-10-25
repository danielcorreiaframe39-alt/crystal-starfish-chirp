import { Link } from "react-router-dom";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowRight,
  Trophy,
  Users,
  Sparkles,
  ClipboardList,
  Activity,
  TrendingUp,
  Target,
} from "lucide-react";

const metrics = [
  {
    label: "Pessoas engajadas",
    value: "86",
    delta: "+12%",
    icon: Users,
  },
  {
    label: "Traits aplicados",
    value: "42",
    delta: "+4 novos",
    icon: Sparkles,
  },
  {
    label: "Quizzes ativos",
    value: "12",
    delta: "3 aguardando revisao",
    icon: ClipboardList,
  },
];

const recentSignals = [
  {
    name: "Alice Santos",
    signal: "Empatia",
    progress: 78,
    time: "ha 1h",
  },
  {
    name: "Lucas Meireles",
    signal: "Pensamento Analitico",
    progress: 65,
    time: "ha 3h",
  },
  {
    name: "Fernanda Ivo",
    signal: "Comunicacao",
    progress: 92,
    time: "ha 5h",
  },
];

const spotlightProjects = [
  {
    title: "Playbook de Onboarding",
    owner: "People Ops",
    status: "Em progresso",
    completion: 62,
  },
  {
    title: "Mapa de Experiencias",
    owner: "Employee Success",
    status: "Discovery",
    completion: 34,
  },
];

const Index = () => {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[3fr,2fr]">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
          <CardHeader className="flex flex-col gap-6 pb-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <Badge className="w-fit bg-primary/15 text-primary">
                Ultimo ciclo
              </Badge>
              <CardTitle className="text-3xl lg:text-4xl">
                Radar cultural preparado
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Acompanhe clima, tracos e jornadas de aprendizagem em um unico
                painel. Use os atalhos abaixo para avancar rapidamente.
              </CardDescription>
            </div>
            <div className="flex w-full gap-2 lg:w-auto">
              <Button asChild variant="outline" className="flex-1 lg:flex-none">
                <Link to="/traits" className="gap-2">
                  Biblioteca de traits
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild className="flex-1 lg:flex-none">
                <Link to="/quizzes" className="gap-2">
                  Criar quiz
                  <Sparkles className="size-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 pt-4 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-primary/10 p-4"
              >
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-sm">{metric.label}</span>
                  <metric.icon className="size-4" />
                </div>
                <p className="mt-3 text-3xl font-semibold">{metric.value}</p>
                <p className="text-sm text-emerald-500">{metric.delta}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="size-4 text-primary" />
              Proximos checkpoints
            </CardTitle>
            <CardDescription>
              Eventos automatizados para manter o time alinhado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <p className="text-sm font-semibold">Office Hours</p>
                <p className="text-sm text-muted-foreground">
                  Amanha, 09:30 - Cultura e Operacoes
                </p>
              </div>
              <Badge variant="secondary">Confirmado</Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <p className="text-sm font-semibold">Envio de pulse</p>
                <p className="text-sm text-muted-foreground">
                  Sexta-feira, 11:00 - Equipe de Produto
                </p>
              </div>
              <Badge variant="outline">Automatizado</Badge>
            </div>
            <div className="rounded-xl border p-4">
              <p className="text-sm font-semibold">OKR people-first</p>
              <div className="mt-3 flex items-center gap-3">
                <Progress value={68} className="flex-1" />
                <span className="text-sm font-semibold text-primary">68%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Radar em tempo real</CardTitle>
              <CardDescription>
                Ultimas interacoes dos squads e talentos.
              </CardDescription>
            </div>
            <Button asChild size="sm" variant="outline" className="gap-1">
              <Link to="/employees">
                Abrir equipe
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-5">
            {recentSignals.map((signal) => (
              <div
                key={signal.name}
                className="flex items-center gap-4 rounded-2xl border p-4"
              >
                <Avatar className="border bg-primary/5">
                  <AvatarFallback>
                    {signal.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{signal.name}</p>
                    <span className="text-xs text-muted-foreground">
                      {signal.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    sinalizou {signal.signal}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <Progress value={signal.progress} className="flex-1" />
                    <span className="text-sm font-semibold">
                      {signal.progress}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Spotlight</CardTitle>
            <CardDescription>Projetos estrategicos acompanhados.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="projects">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="projects">Projetos</TabsTrigger>
                <TabsTrigger value="okr">Metas</TabsTrigger>
              </TabsList>
              <TabsContent value="projects" className="space-y-4 pt-4">
                {spotlightProjects.map((project) => (
                  <div
                    key={project.title}
                    className="rounded-2xl border p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{project.title}</p>
                      <Badge variant="secondary">{project.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Squad: {project.owner}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <Progress value={project.completion} className="flex-1" />
                      <span className="text-sm font-semibold">
                        {project.completion}%
                      </span>
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="okr" className="space-y-4 pt-4">
                <div className="rounded-2xl border p-5">
                  <p className="text-sm font-semibold text-primary">
                    Objetivo 01
                  </p>
                  <p className="text-lg font-semibold">
                    Ser referencia em cultura distribuida
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <TrendingUp className="size-4 text-emerald-500" />
                      3 iniciativas aceleradas
                    </li>
                    <li className="flex items-center gap-2">
                      <Target className="size-4 text-primary" />
                      2 squads mapeando lacunas
                    </li>
                    <li className="flex items-center gap-2">
                      <Trophy className="size-4 text-yellow-500" />
                      Meta trimestral em 68% concluida
                    </li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>

      <div className="flex flex-col items-start gap-4 rounded-3xl border bg-background/80 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
            Crystal Starfish
          </p>
          <h2 className="mt-1 text-2xl font-semibold">
            Continue a jornada de cultura e aprendizagem
          </h2>
          <p className="text-muted-foreground">
            Conecte dados de traits, quizzes e rituais personalizados para cada
            squad.
          </p>
        </div>
        <Button asChild size="lg" className="gap-2">
          <Link to="/employees">
            Abrir playbook da equipe
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;
