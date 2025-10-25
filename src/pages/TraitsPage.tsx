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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { showError, showSuccess } from "@/utils/toast";
import type { Tables, TablesInsert } from "@/types/supabase";
import { formatDistanceToNow } from "date-fns";
import { Sparkles, Layers3, Rocket } from "lucide-react";

type Trait = Tables<"traits">;

const TraitsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newTrait, setNewTrait] = useState({ name: "", description: "" });
  const [filter, setFilter] = useState<"all" | "recent">("all");

  const traitsQuery = useQuery({
    queryKey: ["traits", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("traits")
        .select("*")
        .eq("created_by", user!.id)
        .order("created_at", { ascending: false });
      if (error) {
        throw error;
      }
      return data as Trait[];
    },
  });

  const createTrait = useMutation({
    mutationFn: async (payload: TablesInsert<"traits">) => {
      const { data, error } = await supabase
        .from("traits")
        .insert(payload)
        .select()
        .single();
      if (error) {
        throw error;
      }
      return data as Trait;
    },
    onSuccess: () => {
      showSuccess("Trait criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["traits", user?.id] });
      setNewTrait({ name: "", description: "" });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Falha ao criar trait.";
      showError(message);
    },
  });

  const deleteTrait = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("traits").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Trait removido.");
      queryClient.invalidateQueries({ queryKey: ["traits", user?.id] });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Falha ao remover trait.";
      showError(message);
    },
  });

  const filteredTraits = useMemo(() => {
    if (!traitsQuery.data) return [];
    if (filter === "recent") {
      return traitsQuery.data.slice(0, 5);
    }
    return traitsQuery.data;
  }, [filter, traitsQuery.data]);

  const stats = useMemo(() => {
    const count = traitsQuery.data?.length ?? 0;
    const lastTrait = traitsQuery.data?.[0];
    const freshness = lastTrait?.created_at
      ? formatDistanceToNow(new Date(lastTrait.created_at), { addSuffix: true })
      : "sem registros";
    return { count, lastName: lastTrait?.name ?? "Nenhum trait", freshness };
  }, [traitsQuery.data]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?.id || !newTrait.name.trim()) {
      showError("Preencha nome e descricao.");
      return;
    }
    createTrait.mutate({
      name: newTrait.name,
      description: newTrait.description,
      created_by: user.id,
    });
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Biblioteca PsyTrack
        </p>
        <h1 className="text-3xl font-semibold">Traits comportamentais</h1>
        <p className="text-muted-foreground">
          Alinhe linguagem e avaliacoes com a mesma fonte de verdade.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Traits publicados
            </CardTitle>
            <Layers3 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{stats.count}</p>
            <CardDescription>Total criado por voce</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Ultimo registro
            </CardTitle>
            <Sparkles className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{stats.lastName}</p>
            <CardDescription>{stats.freshness}</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Adocao estimada
            </CardTitle>
            <Rocket className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Progress
                value={Math.min(stats.count * 12, 100)}
                className="flex-1"
              />
              <span className="text-sm font-semibold">
                {Math.min(stats.count * 12, 100)}%
              </span>
            </div>
            <CardDescription>Estimativa baseada nos quizzes ativos</CardDescription>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Adicionar trait</CardTitle>
            <CardDescription>
              Nome e descricao serao exibidos nos quizzes e assessments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="trait-name">
                  Nome
                </label>
                <Input
                  id="trait-name"
                  placeholder="Ex.: Empatia pragmatica"
                  value={newTrait.name}
                  onChange={(event) =>
                    setNewTrait((prev) => ({ ...prev, name: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="trait-description">
                  Descricao observavel
                </label>
                <Textarea
                  id="trait-description"
                  rows={4}
                  placeholder="Defina comportamentos, exemplos e indicadores."
                  value={newTrait.description}
                  onChange={(event) =>
                    setNewTrait((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={createTrait.isLoading}
              >
                {createTrait.isLoading ? "Salvando..." : "Publicar trait"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Lista de traits</CardTitle>
                <CardDescription>
                  Mostrando {filteredTraits.length} registros.
                </CardDescription>
              </div>
              <Tabs value={filter} onValueChange={(value) => setFilter(value as "all" | "recent")}>
                <TabsList>
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="recent">Recentes</TabsTrigger>
                </TabsList>
                <TabsContent value="all" />
                <TabsContent value="recent" />
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {traitsQuery.isLoading && (
              <p className="text-sm text-muted-foreground">Carregando...</p>
            )}
            {!traitsQuery.isLoading && filteredTraits.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhum trait cadastrado ainda. Crie o primeiro ao lado.
              </p>
            )}
            {filteredTraits.map((trait) => (
              <div
                key={trait.id}
                className="rounded-2xl border bg-background/80 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold">{trait.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {trait.description || "Sem descricao."}
                    </p>
                  </div>
                  <Badge variant="secondary" className="whitespace-nowrap">
                    {trait.created_at
                      ? formatDistanceToNow(new Date(trait.created_at), {
                          addSuffix: true,
                        })
                      : "sem data"}
                  </Badge>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Trait
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                    onClick={() => deleteTrait.mutate(trait.id)}
                    disabled={deleteTrait.isLoading}
                  >
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default TraitsPage;

