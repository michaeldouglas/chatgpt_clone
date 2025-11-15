import Image from "next/image";

interface WelcomeScreenProps {
  apiKey: string;
  handleSend: (prompt: string) => void;
}

const EXAMPLE_PROMPTS = "Quem é o usuário com o id: 1234567890?";

export function WelcomeScreen({ apiKey, handleSend }: WelcomeScreenProps) {
  if (!apiKey.trim()) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col items-center text-center">
        <Image
          src="/md_logo.png"
          alt="MD Logo"
          width={120}
          height={120}
          className="mb-6 rounded-full"
          priority
        />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Bem vindo ao MD Clone GPT!
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          Tutorial de exemplo de como usar o LangChain com NextJS para a criação
          de um agente com
          <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-900 rounded">
            createAgent
          </code>
        </p>
      </div>
      <div className="mt-8 max-w-md mx-auto w-full relative">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 text-center">
          Tente enviar algo
        </p>
        <div className="relative group">
          <button
            onClick={() => {
              handleSend(EXAMPLE_PROMPTS);
            }}
            className="text-left px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-colors w-full cursor-pointer"
          >
            <span className="flex items-start gap-2">
              <span className="text-gray-400 dark:text-gray-500"> 💭 </span>
              <span>{EXAMPLE_PROMPTS}</span>
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
