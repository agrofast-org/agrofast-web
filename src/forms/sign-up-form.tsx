import Checkbox from "@/components/checkbox";
import Form from "@/components/form";
import Input from "@/components/input";
import Link from "@/components/link";
import { PrivacyPolicy, TermsOfUse } from "@/components/ui/platform-agreements";
import { useUser } from "@/contexts/auth-provider";
import { useLanguage } from "@/contexts/language-provider";
import { useOverlay } from "@/contexts/overlay-provider";
import api from "@/service/api";
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

const SignInForm: React.FC = () => {
  const t = useTranslations();
  const router = useRouter();
  const { setIsLoading } = useOverlay();
  const { translateResponse } = useLanguage();
  const { setUser, setToken } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [email, setEmail] = useState<string>(
    Array.isArray(router.query.email)
      ? router.query.email[0]
      : router.query.email || ""
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [modalContent, setModalContent] = useState<JSX.Element | undefined>();

  const openTermsOfUse = () => {
    setModalContent(<TermsOfUse />);
    onOpen();
  };

  const openPrivacyPolicy = () => {
    setModalContent(<PrivacyPolicy />);
    onOpen();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    setIsLoading(true);
    api
      .post("/user", data)
      .then(({ data }) => {
        api.interceptors.request.use((config) => {
          config.headers.Authorization = `Bearer ${data.token}`;
          return config;
        });
        setToken(data.token);
        setUser(data.user);
        router.push(`/auth-code`);
      })
      .catch(({ response: { data: error } }) => {
        // const fields = translateResponse(error.errors);
        // setErrors(fields);
        console.log(error.errors);
        
        setErrors(error.errors);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
      <Form
        className="flex flex-col gap-4"
        validationErrors={errors}
        onSubmit={handleSubmit}
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
            <>
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
            </>
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
      </Form>
      <p className="text-small text-center">
        <Link
          href={{
            pathname: "/login",
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
