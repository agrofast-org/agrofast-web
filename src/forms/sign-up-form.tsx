import { Checkbox } from "@/components/input/checkbox";
import { Input } from "@/components/input/input";
import Link from "@/components/link";
import { PrivacyPolicy, TermsOfUse } from "@/components/ui/platform-agreements";
import { useUser } from "@/contexts/auth-provider";
import { signUp } from "@/http/user/sign-up";
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  Spacer,
  useDisclosure,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { JSX, useState } from "react";
import { RequestForm } from "@/components/request-form";

const SignInForm: React.FC = () => {
  const t = useTranslations();
  const router = useRouter();
  const { setUser, setToken } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [email, setEmail] = useState<string>("");

  const [modalContent, setModalContent] = useState<JSX.Element | undefined>();

  const openTermsOfUse = () => {
    setModalContent(<TermsOfUse />);
    onOpen();
  };

  const openPrivacyPolicy = () => {
    setModalContent(<PrivacyPolicy />);
    onOpen();
  };

  return (
    <>
      <Modal
        scrollBehavior="inside"
        isOpen={isOpen}
        size="2xl"
        onClose={onClose}
      >
        <ModalContent className="m-1 md:m-0 max-h-[calc(100vh-8px)] md:max-h-[calc(100vh-4rem)]">
          {(onClose) => (
            <>
              {modalContent}
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  {t("UI.buttons.understood")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <RequestForm
        className="!flex !flex-col gap-4"
        initialData={router.query}
        onSubmit={signUp}
        onSuccess={({ data }) => {
          setUser(data.user);
          setToken(data.token);
          router.push(`/web/auth-code`);
        }}
      >
        <Input
          name="name"
          label={t("UI.labels.name")}
          placeholder={t("UI.placeholders.write_name")}
          type="name"
          autoCapitalize="words"
          isRequired
        />
        <Input
          name="surname"
          label={t("UI.labels.surname")}
          placeholder={t("UI.placeholders.write_surname")}
          type="name"
          autoCapitalize="words"
          isRequired
        />
        <Input
          id="email"
          name="email"
          label={t("UI.labels.email")}
          placeholder={t("UI.placeholders.write_email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          isRequired
        />
        <Input
          name="password"
          label={t("UI.labels.password")}
          placeholder={t("UI.placeholders.write_password")}
          type="password"
          taggableVisibility
          isRequired
        />
        <Input
          name="password_confirm"
          label={t("UI.labels.password_confirm")}
          placeholder={t("UI.placeholders.write_password_confirm")}
          type="password"
          taggableVisibility
          isRequired
        />
        <div>
          <Checkbox defaultSelected name="remember" value="true" size="sm">
            {t("UI.checkboxes.remember_me")}
          </Checkbox>
          <Checkbox name="terms_and_privacy_agreement" value="true" size="sm">
            <p>
              {t.rich("Legal.agreements.accept_policy_and_terms", {
                use: (chunks) => (
                  <span
                    onClick={() => {
                      openTermsOfUse();
                    }}
                    className="hover:opacity-80 font-medium text-primary text-sm hover:underline transition-all cursor-pointer"
                  >
                    {chunks}
                  </span>
                ),
                privacy: (chunks) => (
                  <span
                    onClick={() => {
                      openPrivacyPolicy();
                    }}
                    className="hover:opacity-80 font-medium text-primary text-sm hover:underline transition-all cursor-pointer"
                  >
                    {chunks}
                  </span>
                ),
              })}
            </p>
          </Checkbox>
        </div>
        <input type="hidden" name="language" value={router.locale} />
        <Spacer y={4} />
        <p className="text-gray-700 dark:text-gray-200 text-small text-start">
          {t("Legal.agreements.sign_in_terms")}
        </p>
        <Button className="w-full" color="primary" type="submit">
          {t("UI.buttons.continue")}
        </Button>
      </RequestForm>
      <p className="pb-4 text-small text-center">
        <Link
          href={{
            pathname: "/web/login",
            query: {
              email: email,
            },
          }}
          className="hover:opacity-80 font-medium text-primary text-sm hover:underline transition-all"
        >
          {t("UI.redirects.enter_existing_account")}
        </Link>
      </p>
    </>
  );
};

export default SignInForm;
