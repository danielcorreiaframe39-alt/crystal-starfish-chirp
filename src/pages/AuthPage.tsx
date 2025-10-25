import { useEffect, useState } from "react";
import { useNavigate, useLocation, type Location } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showError, showSuccess } from "@/utils/toast";

const AuthPage = () => {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = (location.state as { from?: Location })?.from?.pathname;

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    companyName: "",
    role: "psychologist" as "psychologist" | "company",
  });

  useEffect(() => {
    if (user) {
      navigate(redirectPath ?? "/", { replace: true });
    }
  }, [user, navigate, redirectPath]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === "signin") {
        await signIn({ email: form.email, password: form.password });
        showSuccess("Bem-vindo de volta!");
      } else {
        await signUp({
          email: form.email,
          password: form.password,
          role: form.role,
          fullName: form.fullName,
          companyName: form.companyName,
        });
        showSuccess("Cadastro realizado. Verifique seu email se necessario.");
        setMode("signin");
      }
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Algo deu errado.";
      showError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-xl border border-primary/10">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            PsyTrack
          </div>
          <CardTitle className="text-2xl font-semibold">
            Conecte-se ao PsyTrack
          </CardTitle>
          <CardDescription>
            Psicologos criam experiencias. Empresas acompanham talentos.
          </CardDescription>
          <Tabs
            value={mode}
            onValueChange={(value) => setMode(value as "signin" | "signup")}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="signin">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Criar conta</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" />
            <TabsContent value="signup" />
          </Tabs>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="role">Tipo de conta</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={form.role === "psychologist" ? "default" : "outline"}
                      onClick={() =>
                        setForm((prev) => ({ ...prev, role: "psychologist" }))
                      }
                    >
                      Psicologo
                    </Button>
                    <Button
                      type="button"
                      variant={form.role === "company" ? "default" : "outline"}
                      onClick={() =>
                        setForm((prev) => ({ ...prev, role: "company" }))
                      }
                    >
                      Empresa
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome completo</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Ex.: Ana Teixeira"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                {form.role === "company" && (
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Empresa</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      placeholder="Nome da empresa"
                      value={form.companyName}
                      onChange={handleChange}
                      required={form.role === "company"}
                    />
                  </div>
                )}
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email corporativo</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="voce@empresa.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="********"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? "Processando..."
                : mode === "signin"
                ? "Entrar"
                : "Criar conta"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
