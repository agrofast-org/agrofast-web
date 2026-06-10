import { Layout } from "@/components/layout";
import { MainTitle } from "@/components/typography";
import { getStaticPropsWithMessages } from "@/lib/get-static-props";
import { Accordion, AccordionItem, Spacer } from "@heroui/react";
import Head from "next/head";

export default function FrequentlyAskedQuestions() {
  return (
    <>
      <Head>
        <title>Dúvidas Frequentes | TerraMov</title>
        <meta
          name="description"
          content="Confira as principais dúvidas sobre cadastro, login, solicitações, ofertas, pagamentos, transporte e uso da plataforma TerraMov."
        />
      </Head>

      <Layout>
        <section className="flex flex-col items-start gap-4 mx-auto max-w-4xl p-4 container">
          <MainTitle>Dúvidas Frequentes</MainTitle>

          <p className="text-gray-700 dark:text-gray-300">
            Esta página reúne as principais dúvidas sobre o uso do TerraMov,
            plataforma voltada à intermediação do transporte de maquinários
            agrícolas. As informações abaixo ajudam solicitantes e
            transportadores a entenderem melhor o funcionamento da aplicação.
          </p>

          <Spacer />

          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Acesso e cadastro
          </h2>

          <Accordion>
            <AccordionItem
              key="como-acessar"
              classNames={{ trigger: "py-2" }}
              title="Como posso acessar a plataforma?"
            >
              O acesso à plataforma pode ser realizado pelo endereço{" "}
              <strong>https://terramov.mesf.app</strong>. Ao entrar no site, o
              usuário pode criar uma nova conta ou acessar uma conta já
              existente.
            </AccordionItem>

            <AccordionItem
              key="como-criar-conta"
              classNames={{ trigger: "py-2" }}
              title="Como criar uma conta?"
            >
              Para criar uma conta, o usuário deve acessar a opção de cadastro e
              informar os dados solicitados, como nome, sobrenome, e-mail e
              senha. Após o preenchimento, o sistema valida as informações e
              permite o acesso à plataforma.
            </AccordionItem>

            <AccordionItem
              key="ja-tenho-conta"
              classNames={{ trigger: "py-2" }}
              title="Já tenho uma conta. Como faço login?"
            >
              Usuários já cadastrados podem acessar a plataforma informando o
              e-mail e a senha registrados no momento do cadastro. Após a
              autenticação, o usuário é direcionado para a área principal da
              aplicação.
            </AccordionItem>

            <AccordionItem
              key="esqueci-senha"
              classNames={{ trigger: "py-2" }}
              title="Esqueci minha senha. O que devo fazer?"
            >
              Caso o usuário esqueça sua senha, poderá utilizar a opção de
              recuperação de acesso disponível na tela de login. O sistema
              solicitará as informações necessárias para iniciar o processo de
              redefinição da senha.
            </AccordionItem>

            <AccordionItem
              key="perfil-obrigatorio"
              classNames={{ trigger: "py-2" }}
              title="Preciso escolher um perfil para usar a plataforma?"
            >
              Sim. O usuário deve utilizar a plataforma como solicitante ou como
              transportador. Cada perfil possui funcionalidades específicas
              dentro do sistema.
            </AccordionItem>
          </Accordion>

          <Spacer />

          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Perfis de usuário
          </h2>

          <Accordion>
            <AccordionItem
              key="perfil-solicitante"
              classNames={{ trigger: "py-2" }}
              title="O que é o perfil solicitante?"
            >
              O perfil solicitante é destinado ao usuário que precisa transportar
              um maquinário agrícola. Esse perfil permite cadastrar máquinas,
              criar solicitações de transporte, visualizar propostas, realizar
              pagamentos e acompanhar o andamento do serviço.
            </AccordionItem>

            <AccordionItem
              key="perfil-transportador"
              classNames={{ trigger: "py-2" }}
              title="O que é o perfil transportador?"
            >
              O perfil transportador é destinado ao usuário que oferece o
              serviço de transporte. Esse perfil permite cadastrar veículos,
              visualizar solicitações disponíveis, enviar propostas, acompanhar
              transportes aceitos e solicitar saque dos valores disponíveis.
            </AccordionItem>

            <AccordionItem
              key="trocar-perfil"
              classNames={{ trigger: "py-2" }}
              title="Posso alterar meu perfil?"
            >
              A plataforma permite que o usuário utilize funcionalidades
              conforme o perfil configurado. Caso seja necessário alterar o tipo
              de perfil, o usuário deve acessar as configurações disponíveis na
              conta.
            </AccordionItem>

            <AccordionItem
              key="funcionalidades-diferentes"
              classNames={{ trigger: "py-2" }}
              title="Por que vejo funções diferentes de outro usuário?"
            >
              As funcionalidades exibidas dependem do perfil utilizado. Um
              solicitante visualiza recursos relacionados à criação de
              solicitações e pagamento, enquanto um transportador visualiza
              recursos relacionados ao envio de propostas, veículos e ganhos.
            </AccordionItem>
          </Accordion>

          <Spacer />

          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Maquinários e veículos
          </h2>

          <Accordion>
            <AccordionItem
              key="cadastrar-maquinario"
              classNames={{ trigger: "py-2" }}
              title="Como cadastrar um maquinário?"
            >
              O solicitante pode acessar a área de maquinários e informar os
              dados da máquina agrícola, como nome, modelo, tipo, dimensões,
              peso e outras informações necessárias para o transporte.
            </AccordionItem>

            <AccordionItem
              key="quem-cadastra-maquinario"
              classNames={{ trigger: "py-2" }}
              title="Quem pode cadastrar maquinários?"
            >
              Apenas usuários com perfil de solicitante podem cadastrar
              maquinários agrícolas na plataforma.
            </AccordionItem>

            <AccordionItem
              key="cadastrar-veiculo"
              classNames={{ trigger: "py-2" }}
              title="Como cadastrar um veículo de transporte?"
            >
              O transportador pode acessar a área de veículos e informar os
              dados do veículo utilizado para realizar transportes, como nome,
              identificação, tipo e informações operacionais.
            </AccordionItem>

            <AccordionItem
              key="quem-cadastra-veiculo"
              classNames={{ trigger: "py-2" }}
              title="Quem pode cadastrar veículos?"
            >
              Apenas usuários com perfil de transportador podem cadastrar
              veículos destinados ao transporte de maquinários agrícolas.
            </AccordionItem>
          </Accordion>

          <Spacer />

          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Solicitações de transporte
          </h2>

          <Accordion>
            <AccordionItem
              key="criar-solicitacao"
              classNames={{ trigger: "py-2" }}
              title="Como criar uma solicitação de transporte?"
            >
              Para criar uma solicitação, o solicitante deve informar os dados
              do transporte, como origem, destino e maquinário que será
              transportado. Após o envio, a solicitação fica disponível para que
              transportadores possam visualizar e enviar propostas.
            </AccordionItem>

            <AccordionItem
              key="dados-solicitacao"
              classNames={{ trigger: "py-2" }}
              title="Quais informações são necessárias para criar uma solicitação?"
            >
              A solicitação precisa conter, no mínimo, informações de origem,
              destino e maquinário. Esses dados são utilizados para calcular a
              distância, sugerir rota e permitir que o transportador avalie o
              serviço.
            </AccordionItem>

            <AccordionItem
              key="acompanhar-solicitacao"
              classNames={{ trigger: "py-2" }}
              title="Como acompanhar uma solicitação criada?"
            >
              O solicitante pode acompanhar suas solicitações pela área de
              chamados ou transportes da plataforma. Nessa área, é possível
              visualizar o status, propostas recebidas e andamento do serviço.
            </AccordionItem>

            <AccordionItem
              key="cancelar-solicitacao"
              classNames={{ trigger: "py-2" }}
              title="Posso cancelar uma solicitação?"
            >
              O cancelamento pode depender do estado atual da solicitação. Em
              geral, solicitações ainda não aceitas ou sem pagamento confirmado
              podem ser canceladas com maior facilidade.
            </AccordionItem>
          </Accordion>

          <Spacer />

          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Ofertas e propostas
          </h2>

          <Accordion>
            <AccordionItem
              key="enviar-oferta"
              classNames={{ trigger: "py-2" }}
              title="Como o transportador envia uma oferta?"
            >
              O transportador deve acessar uma solicitação disponível, analisar
              os dados do transporte e informar o valor da proposta. Também pode
              selecionar o veículo que será utilizado e enviar uma mensagem ao
              solicitante.
            </AccordionItem>

            <AccordionItem
              key="valor-oferta"
              classNames={{ trigger: "py-2" }}
              title="O que é o valor da oferta?"
            >
              O valor da oferta corresponde ao preço proposto pelo transportador
              para realizar o serviço de transporte. Esse valor será apresentado
              ao solicitante para análise e possível aceite.
            </AccordionItem>

            <AccordionItem
              key="oferta-minima"
              classNames={{ trigger: "py-2" }}
              title="O que significa oferta mínima?"
            >
              A oferta mínima é um valor de referência calculado pela plataforma
              com base nos dados da solicitação. Ela auxilia o transportador na
              definição de uma proposta compatível com o transporte solicitado.
            </AccordionItem>

            <AccordionItem
              key="aceitar-oferta"
              classNames={{ trigger: "py-2" }}
              title="Como o solicitante aceita uma oferta?"
            >
              O solicitante pode visualizar as propostas recebidas e selecionar a
              oferta que considerar mais adequada. Após o aceite, o sistema
              avança para a etapa de pagamento.
            </AccordionItem>

            <AccordionItem
              key="ofertas-concorrentes"
              classNames={{ trigger: "py-2" }}
              title="O que acontece com as outras ofertas após o aceite?"
            >
              Após o aceite de uma proposta, as demais ofertas relacionadas à
              mesma solicitação são encerradas ou desconsideradas, pois a
              solicitação passa a seguir com o transportador selecionado.
            </AccordionItem>
          </Accordion>

          <Spacer />

          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Pagamentos e saques
          </h2>

          <Accordion>
            <AccordionItem
              key="como-pagar"
              classNames={{ trigger: "py-2" }}
              title="Como funciona o pagamento?"
            >
              Após o aceite de uma proposta, o sistema gera uma cobrança para o
              solicitante. A confirmação do pagamento é necessária para que o
              transporte seja autorizado.
            </AccordionItem>

            <AccordionItem
              key="pagamento-pix"
              classNames={{ trigger: "py-2" }}
              title="A plataforma aceita PIX?"
            >
              Sim. A plataforma utiliza pagamento via PIX para facilitar a
              cobrança e a confirmação do pagamento relacionado ao transporte.
            </AccordionItem>

            <AccordionItem
              key="confirmacao-pagamento"
              classNames={{ trigger: "py-2" }}
              title="O que acontece após a confirmação do pagamento?"
            >
              Após a confirmação do pagamento, o transporte é autorizado e o
              transportador pode iniciar a execução do serviço conforme as
              informações da solicitação.
            </AccordionItem>

            <AccordionItem
              key="ganhos-transportador"
              classNames={{ trigger: "py-2" }}
              title="Quando o valor fica disponível para o transportador?"
            >
              O valor fica disponível ao transportador após a conclusão do
              transporte e a confirmação das condições necessárias pela
              plataforma.
            </AccordionItem>

            <AccordionItem
              key="solicitar-saque"
              classNames={{ trigger: "py-2" }}
              title="Como o transportador solicita saque?"
            >
              O transportador pode solicitar saque dos valores disponíveis por
              meio da área financeira da plataforma. A solicitação poderá passar
              por análise administrativa antes da liberação.
            </AccordionItem>

            <AccordionItem
              key="saque-rejeitado"
              classNames={{ trigger: "py-2" }}
              title="Uma solicitação de saque pode ser rejeitada?"
            >
              Sim. Uma solicitação de saque pode ser rejeitada caso existam
              inconsistências, pendências ou alguma condição que impeça a
              liberação do valor naquele momento.
            </AccordionItem>
          </Accordion>

          <Spacer />

          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Mapas, rotas e cálculo de valor
          </h2>

          <Accordion>
            <AccordionItem
              key="uso-mapas"
              classNames={{ trigger: "py-2" }}
              title="Para que a plataforma usa mapas?"
            >
              Os mapas são utilizados para validar endereços, calcular a
              distância entre origem e destino e exibir uma sugestão de rota para
              o transporte.
            </AccordionItem>

            <AccordionItem
              key="rota-sugerida"
              classNames={{ trigger: "py-2" }}
              title="A rota exibida é obrigatória?"
            >
              A rota exibida funciona como uma sugestão baseada nos endereços
              informados. Ela auxilia na visualização do trajeto e no cálculo
              estimado, mas pode estar sujeita a ajustes conforme condições reais
              de deslocamento.
            </AccordionItem>

            <AccordionItem
              key="calculo-valor"
              classNames={{ trigger: "py-2" }}
              title="Como o valor do transporte é calculado?"
            >
              O valor estimado considera a distância entre origem e destino, a
              taxa base por quilômetro, o multiplicador de distância e o custo
              adicional de combustível definido pela aplicação.
            </AccordionItem>

            <AccordionItem
              key="valor-final"
              classNames={{ trigger: "py-2" }}
              title="O valor calculado é definitivo?"
            >
              O valor apresentado funciona como uma estimativa inicial. O preço
              final pode ser ajustado pela proposta enviada pelo transportador e
              aceito pelo solicitante.
            </AccordionItem>

            <AccordionItem
              key="endereco-invalido"
              classNames={{ trigger: "py-2" }}
              title="O que acontece se o endereço informado for inválido?"
            >
              Caso o endereço não seja reconhecido ou validado pelo serviço de
              mapas, o usuário deverá revisar as informações e tentar informar
              um endereço mais completo ou correto.
            </AccordionItem>
          </Accordion>

          <Spacer />

          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Execução do transporte
          </h2>

          <Accordion>
            <AccordionItem
              key="quando-inicia"
              classNames={{ trigger: "py-2" }}
              title="Quando o transporte pode ser iniciado?"
            >
              O transporte pode ser iniciado após o aceite da proposta e a
              confirmação do pagamento. Antes disso, o sistema não considera a
              operação autorizada para execução.
            </AccordionItem>

            <AccordionItem
              key="status-transporte"
              classNames={{ trigger: "py-2" }}
              title="Quais status uma solicitação pode ter?"
            >
              A solicitação pode passar por diferentes estados, como pendente,
              aguardando oferta, pagamento pendente, aprovado, em progresso,
              concluído ou cancelado.
            </AccordionItem>

            <AccordionItem
              key="conclusao-transporte"
              classNames={{ trigger: "py-2" }}
              title="Como o transporte é concluído?"
            >
              O transporte é concluído quando a entrega ou finalização do serviço
              é confirmada na plataforma. Após essa etapa, podem ser liberadas
              ações como avaliação e solicitação de saque.
            </AccordionItem>

            <AccordionItem
              key="problema-transporte"
              classNames={{ trigger: "py-2" }}
              title="O que fazer se houver algum problema durante o transporte?"
            >
              Em caso de dúvidas ou problemas, os usuários podem utilizar o chat
              interno para comunicação. Também é recomendado verificar as
              informações da solicitação, proposta e status do transporte dentro
              da plataforma.
            </AccordionItem>
          </Accordion>

          <Spacer />

          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Comunicação e notificações
          </h2>

          <Accordion>
            <AccordionItem
              key="chat"
              classNames={{ trigger: "py-2" }}
              title="A plataforma possui chat?"
            >
              Sim. O TerraMov possui um sistema de mensagens interno para
              facilitar a comunicação entre solicitantes e transportadores.
            </AccordionItem>

            <AccordionItem
              key="quando-usar-chat"
              classNames={{ trigger: "py-2" }}
              title="Quando devo usar o chat?"
            >
              O chat pode ser utilizado para esclarecer dúvidas sobre o
              transporte, combinar detalhes operacionais e trocar informações
              relacionadas à solicitação ou proposta.
            </AccordionItem>

            <AccordionItem
              key="notificacoes"
              classNames={{ trigger: "py-2" }}
              title="Quando recebo notificações?"
            >
              O usuário pode receber notificações quando houver mudanças
              relevantes em solicitações, propostas, pagamentos ou transportes.
            </AccordionItem>

            <AccordionItem
              key="notificacoes-email"
              classNames={{ trigger: "py-2" }}
              title="As notificações são enviadas por e-mail?"
            >
              A plataforma pode enviar notificações automáticas por e-mail para
              informar atualizações importantes relacionadas às operações do
              usuário.
            </AccordionItem>
          </Accordion>

          <Spacer />

          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Avaliações e reputação
          </h2>

          <Accordion>
            <AccordionItem
              key="avaliar"
              classNames={{ trigger: "py-2" }}
              title="Quando posso avaliar outro usuário?"
            >
              A avaliação somente pode ser realizada após a conclusão do
              transporte. Essa regra ajuda a garantir que a avaliação seja
              baseada em uma experiência real dentro da plataforma.
            </AccordionItem>

            <AccordionItem
              key="quem-avalia"
              classNames={{ trigger: "py-2" }}
              title="Quem pode avaliar?"
            >
              Solicitantes e transportadores podem avaliar reciprocamente após a
              conclusão do transporte.
            </AccordionItem>

            <AccordionItem
              key="importancia-avaliacao"
              classNames={{ trigger: "py-2" }}
              title="Por que as avaliações são importantes?"
            >
              As avaliações contribuem para a reputação dos usuários e ajudam a
              tornar o ambiente da plataforma mais confiável para futuras
              solicitações e propostas.
            </AccordionItem>
          </Accordion>

          <Spacer />

          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Segurança e responsabilidades
          </h2>

          <Accordion>
            <AccordionItem
              key="seguranca-dados"
              classNames={{ trigger: "py-2" }}
              title="Meus dados estão seguros?"
            >
              A plataforma utiliza mecanismos de autenticação e comunicação
              segura para proteger o acesso às funcionalidades e às informações
              cadastradas pelos usuários.
            </AccordionItem>

            <AccordionItem
              key="responsabilidade-informacoes"
              classNames={{ trigger: "py-2" }}
              title="Quem é responsável pelas informações cadastradas?"
            >
              Cada usuário é responsável por informar dados corretos e
              atualizados sobre seu perfil, maquinários, veículos, endereços e
              demais informações utilizadas na plataforma.
            </AccordionItem>

            <AccordionItem
              key="seguro"
              classNames={{ trigger: "py-2" }}
              title="A plataforma oferece seguro para o transporte?"
            >
              Na versão atual, a plataforma não realiza contratação automática de
              seguro para o transporte. A inclusão de seguro, cobertura e regras
              específicas pode ser tratada como melhoria futura da aplicação.
            </AccordionItem>

            <AccordionItem
              key="contrato"
              classNames={{ trigger: "py-2" }}
              title="A plataforma substitui contratos formais?"
            >
              Não. O TerraMov atua como uma ferramenta de intermediação digital.
              Obrigações legais, fiscais, contratuais ou operacionais externas à
              plataforma devem ser tratadas pelas partes envolvidas quando
              necessário.
            </AccordionItem>
          </Accordion>

          <Spacer />

          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Problemas comuns
          </h2>

          <Accordion>
            <AccordionItem
              key="nao-consigo-login"
              classNames={{ trigger: "py-2" }}
              title="Não consigo fazer login. O que devo verificar?"
            >
              Verifique se o e-mail e a senha foram digitados corretamente. Caso
              o problema continue, utilize a opção de recuperação de senha ou
              tente acessar novamente após alguns instantes.
            </AccordionItem>

            <AccordionItem
              key="nao-carrega-mapa"
              classNames={{ trigger: "py-2" }}
              title="O mapa não carregou. O que pode ser?"
            >
              O carregamento do mapa depende da conexão com a internet e da
              disponibilidade do serviço externo de mapas. Verifique sua conexão
              e tente recarregar a página.
            </AccordionItem>

            <AccordionItem
              key="pagamento-nao-confirmado"
              classNames={{ trigger: "py-2" }}
              title="Meu pagamento ainda não foi confirmado. O que fazer?"
            >
              A confirmação pode depender do processamento do meio de pagamento.
              Aguarde alguns instantes e verifique novamente o status da
              solicitação dentro da plataforma.
            </AccordionItem>

            <AccordionItem
              key="nao-vejo-solicitacoes"
              classNames={{ trigger: "py-2" }}
              title="Sou transportador e não vejo solicitações disponíveis. Por quê?"
            >
              Pode não haver solicitações disponíveis no momento ou compatíveis
              com os dados informados. Também é importante verificar se o perfil
              de transportador está configurado corretamente.
            </AccordionItem>

            <AccordionItem
              key="nao-consigo-enviar-oferta"
              classNames={{ trigger: "py-2" }}
              title="Não consigo enviar uma oferta. O que verificar?"
            >
              Verifique se você está utilizando o perfil de transportador, se há
              veículo cadastrado e se a solicitação ainda está disponível para
              receber propostas.
            </AccordionItem>

            <AccordionItem
              key="erro-status"
              classNames={{ trigger: "py-2" }}
              title="Apareceu uma tela de erro. O que significa?"
            >
              As telas de erro indicam que algo impediu a conclusão da ação,
              como endereço inexistente, página não encontrada, falha de
              autorização ou problema interno. Nesses casos, revise os dados
              informados ou tente novamente mais tarde.
            </AccordionItem>
          </Accordion>

          <Spacer />

          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Contato
          </h2>

          <Accordion>
            <AccordionItem
              key="como-entrar-contato"
              classNames={{ trigger: "py-2" }}
              title="Como posso entrar em contato?"
            >
              Caso tenha dúvidas adicionais, o usuário pode entrar em contato
              com os responsáveis pelo projeto por meio dos canais informados na
              própria plataforma ou na documentação de apresentação do sistema.
            </AccordionItem>

            <AccordionItem
              key="relatar-problema"
              classNames={{ trigger: "py-2" }}
              title="Como relatar um problema?"
            >
              Para relatar problemas, informe o máximo de detalhes possível,
              como a ação realizada, a mensagem exibida, o horário aproximado e,
              se possível, uma captura da tela em que o erro ocorreu.
            </AccordionItem>
          </Accordion>
        </section>
      </Layout>
    </>
  );
}

export const getStaticProps = getStaticPropsWithMessages;
