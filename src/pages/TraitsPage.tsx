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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Layers3, Rocket, BookOpenCheck } from "lucide-react";

type TraitCategory = "Colaboracao" | "Estrategia" | "Execucao";

type Trait = {
  id: number;
  name: string;
  description: string;
  category: TraitCategory;
  usage: number;
  sentiment: number;
};

const initialTraits: Trait[] = [
  {
    id: 1,
    name: "Empatia Pragmatica",
    description:
      "Habilidade de acolher diferentes pontos de vista e traduzi-los em decisoes objetivas.",
    category: "Colaboracao",
    usage: 68,
    sentiment: 86,
  },
  {
    id: 2,
    name: "Pensamento Modular",
    description:
      "Foco em quebrar problemas complexos em pecas menores com donos claros.",
    category: "Estrategia",
    usage: 54,
    sentiment: 73,
  },
  {
    id: 3,
    name: "Entrega Continua",
    description:
      "Ritmo saudavel de experimentacao, aprendizado e melhoria incremental.",
    category: "Execucao",
    usage: 77,
    sentiment: 90,
  },
  {
    id: 4,
    name: "Curadoria Radical",
    description:
      "Capacidade de traduzir dados e conversas em jornadas de desenvolvimento.",
    category: "Colaboracao",
    usage: 45,
    sentiment: 82,
  },
];

const categoryColors: Record<TraitCategory, string> = {
  Colaboracao: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Estrategia: "bg-indigo-100 text-indigo-700 border-indigo-200",
  Execucao: "bg-amber-100 text-amber-700 border-amber-200",
};

const TraitsPage = () => {
  const [traits, setTraits] = useState(initialTraits);
  const [categoryFilter, setCategoryFilter] =
    useState<TraitCategory | "Todos">("Todos");
  const [newTrait, setNewTrait] = useState({
    name: "",
    description: "",
    category: "Colaboracao" as TraitCategory,
  });

  const filteredTraits = useMemo(() => {
    return traits.filter(
      (trait) => categoryFilter === "Todos" || trait.category === categoryFilter,
    );
  }, [traits, categoryFilter]);

  const stats = useMemo(() => {
    const librarySize = traits.length;
    const avgUsage = Math.round(
      traits.reduce((acc, curr) => acc + curr.usage, 0) / librarySize,
    );
    const avgSentiment = Math.round(
      traits.reduce((acc, curr) => acc + curr.sentiment, 0) / librarySize,
    );

    return { librarySize, avgUsage, avgSentiment };
  }, [traits]);

  const handleAddTrait = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTrait.name.trim() || !newTrait.description.trim()) return;

    const nextId =
      traits.length > 0 ? Math.max(...traits.map((trait) => trait.id)) + 1 : 1;
    setTraits([
      {
        id: nextId,
        name: newTrait.name,
        description: newTrait.description,
        category: newTrait.category,
        usage: 35,
        sentiment: 70,
      },
      ...traits,
    ]);
    setNewTrait({
      name: "",
      description: "",
      category: newTrait.category,
    });
  };

  const handleRemoveTrait = (id: number) => {
    setTraits(traits.filter((trait) => trait.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
            Biblioteca viva
          </p>
          <h1 className="text-3xl font-semibold">
            Traits que sustentam a cultura
          </h1>
          <p className="text-muted-foreground">
            Mapeie comportamentos observaveis e ative jornadas personalizadas.
          </p>
        </div>
        <Button variant="outline" className="w-full lg:w-auto">
          Exportar em CSV
        </Button>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Traits na biblioteca
            </CardTitle>
            <Layers3 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.librarySize}</div>
            <p className="text-xs text-muted-foreground">
              Baseados em dados reais da equipe
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Uso em quizzes
            </CardTitle>
            <Rocket className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgUsage}%</div>
            <p className="text-xs text-muted-foreground">
              Percentual medio de adocao
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sentimento associado
            </CardTitle>
            <Sparkles className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgSentiment}%</div>
            <p className="text-xs text-muted-foreground">
              Score medio dos squads
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr,2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Publicar novo trait</CardTitle>
            <CardDescription>
              Capture comportamentos relevantes e distribua para os squads.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleAddTrait}>
              <Input
                placeholder="Nome do trait"
                value={newTrait.name}
                onChange={(event) =>
                  setNewTrait((prev) => ({ ...prev, name: event.target.value }))
                }
                required
              />
              <Textarea
                placeholder="Descricao observavel e indicadores praticos"
                value={newTrait.description}
                onChange={(event) =>
                  setNewTrait((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                rows={4}
                required
              />
              <Tabs
                value={newTrait.category}
                onValueChange={(value) =>
                  setNewTrait((prev) => ({
                    ...prev,
                    category: value as TraitCategory,
                  }))
                }
              >
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="Colaboracao">Colaboracao</TabsTrigger>
                  <TabsTrigger value="Estrategia">Estrategia</TabsTrigger>
                  <TabsTrigger value="Execucao">Execucao</TabsTrigger>
                </TabsList>
                <TabsContent value="Colaboracao" />
                <TabsContent value="Estrategia" />
                <TabsContent value="Execucao" />
              </Tabs>
              <Button type="submit" className="w-full">
                Adicionar a biblioteca
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Catalogo ativo</CardTitle>
                <CardDescription>
                  Filtre por dominio e acompanhe performance.
                </CardDescription>
              </div>
              <Tabs
                value={categoryFilter}
                onValueChange={(value) =>
                  setCategoryFilter(value as TraitCategory | "Todos")
                }
              >
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="Todos">Todos</TabsTrigger>
                  <TabsTrigger value="Colaboracao">Colab.</TabsTrigger>
                  <TabsTrigger value="Estrategia">Estrategia</TabsTrigger>
                  <TabsTrigger value="Execucao">Execucao</TabsTrigger>
                </TabsList>
                <TabsContent value="Todos" />
                <TabsContent value="Colaboracao" />
                <TabsContent value="Estrategia" />
                <TabsContent value="Execucao" />
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredTraits.map((trait) => (
              <div
                key={trait.id}
                className="rounded-2xl border bg-background/80 p-4 shadow-sm"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-semibold">{trait.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {trait.description}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={categoryColors[trait.category]}
                  >
                    {trait.category}
                  </Badge>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Utilizacao em quizzes
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <Progress value={trait.usage} className="flex-1" />
                      <span className="text-sm font-semibold">
                        {trait.usage}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Sentimento vinculado
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <Progress
                        value={trait.sentiment}
                        className="flex-1 bg-emerald-100"
                      />
                      <span className="text-sm font-semibold text-emerald-600">
                        {trait.sentiment}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <BookOpenCheck className="size-4 text-primary" />
                  usado em 3 playbooks
                  <span className="text-muted-foreground/70">-</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTrait(trait.id)}
                    className="text-red-500 transition hover:text-red-600"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
            {filteredTraits.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nenhum trait nessa categoria ainda.
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default TraitsPage;
