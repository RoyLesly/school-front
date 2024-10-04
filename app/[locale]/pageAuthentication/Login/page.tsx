import { Metadata } from "next";
import LoginForm from "./LoginForm";
import initTranslations from "@/i18n";

const i18nNamespaces: string[] = ['common']
const Home = async ({
  params,
}: {
  params: { locale: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const { t, resources } = await initTranslations(params.locale, i18nNamespaces)

  return (
    // <TranslationsProvider
    //   namespaces={i18nNamespaces}
    //   locale={params.locale}
    //   resources={resources}
    // >
    //   <LoginForm />
    // </TranslationsProvider>
    <LoginForm />


  );
};


export default Home;

export const metadata: Metadata = {
  title:
    "Login",
  description: "This Login",
};

