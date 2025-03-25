import Body from "@/components/body";
import {
  Button,
  Form,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { cn, numberInputMask } from "@/lib/utils";
import Input from "@/components/input";
import { useTranslations } from "next-intl";
import { getWebStaticPropsWithMessages } from "@/lib/getStaticProps";
import Head from "next/head";
import api from "@/service/api";
import { useOverlay } from "@/contexts/overlay-provider";
import { useAuth } from "@/contexts/auth-provider";
import Img from "@/components/image";

import userPicture from "@public/user-default.png";
import Cropper, { Area } from "react-easy-crop";
import { useLanguage } from "@/contexts/language-provider";
import PhoneNumberHelper from "@/components/ux/phone-number-helper";
import { Upload04Icon } from "@hugeicons/react";

export default function SignIn() {
  const t = useTranslations();
  const pt = useTranslations("Pages.SignUp");

  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
  const { translateResponse } = useLanguage();
  const { user, setUser } = useAuth();
  const { setIsLoading } = useOverlay();

  const [userImage, setUserImage] = useState(user?.profile_picture);
  const [imageCrop, setImageCrop] = useState<Area | undefined>();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [email, setEmail] = useState<string>(user?.email ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user?.profile_picture) {
      setUserImage(user.profile_picture);
    }
  }, [user]);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setImageCrop(croppedAreaPixels);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    setIsLoading(true);
    api
      .put("/user", data)
      .then(({ data }) => {
        api.interceptors.request.use((config) => {
          config.headers.Authorization = `Bearer ${data.token}`;
          return config;
        });
      })
      .catch(({ response: { data: error } }) => {
        const fields = translateResponse(error.fields);
        setErrors(fields);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const saveUserPicture = async () => {
    if (userImage && imageCrop) {
      const img = new Image();
      img.src = userImage;

      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = imageCrop.width;
        canvas.height = imageCrop.height;

        ctx.drawImage(
          img,
          imageCrop.x,
          imageCrop.y,
          imageCrop.width,
          imageCrop.height,
          0,
          0,
          imageCrop.width,
          imageCrop.height
        );

        canvas.toBlob(async (blob) => {
          if (!blob) return;

          const formData = new FormData();
          formData.append("image", blob, "profile_picture.png");

          setIsLoading(true);
          try {
            const { data } = await api.post("/user/picture/upload", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            const updatedUser = {
              ...user,
              profile_picture: data.profile_picture,
            };
            setUser(updatedUser as typeof user);
          } catch {
          } finally {
            setIsLoading(false);
            onClose();
          }
        }, "image/png");
      };
    }
  };

  return (
    <>
      <Head>
        <title>{pt("meta.title")}</title>
        <meta name="description" content={pt("meta.description")} />
      </Head>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-gray-700 dark:text-gray-200">
                Foto de perfil
              </ModalHeader>
              <ModalBody>
                <div className="relative p-20 h-96">
                  <Cropper
                    image={userImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    objectFit="contain"
                  />
                </div>
                <div>
                  <label
                    htmlFor="upload-picture"
                    className={cn(
                      "inline-flex relative justify-center items-center gap-4 px-4 rounded-medium w-full min-w-20 h-10 text-sm duration-75 cursor-pointer",
                      "select-none overflow-hidden tap-highlight-transparent active:scale-[0.97] outline-none focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 transition-transform-colors-opacity bg-default text-default-foreground hover:opacity-hover"
                    )}
                  >
                    Escolher uma foto
                    <input
                      id="upload-picture"
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      tabIndex={0}
                      className="absolute inset-0 opacity-0 w-full h-full"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            if (e.target) {
                              setUserImage(e.target.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <Upload04Icon className="text-gray-700 dark:text-gray-200" />
                  </label>
                </div>
              </ModalBody>
              <ModalFooter className="justify-between">
                <Button color="default" onPress={onClose}>
                  Close
                </Button>
                <Button color="success" onPress={saveUserPicture}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Body className="flex flex-row justify-center">
        <div className="flex flex-col flex-1 container">
          <p className="px-8 py-6 pb-2 font-semibold text-gray-700 dark:text-gray-200 text-2xl text-left">
            {t("UI.titles.update_account")}
          </p>
          <div className="flex flex-row gap-4 px-8 py-6 w-full min-h-max">
            <Form
              className="flex flex-col flex-1 gap-4 max-w-md"
              validationBehavior="native"
              validationErrors={errors}
              onSubmit={handleSubmit}
            >
              <Input
                name="name"
                label={t("UI.labels.name")}
                placeholder={t("UI.placeholders.write_name")}
                autoCapitalize="words"
                value={user?.name}
                type="name"
              />
              <Input
                className="text-gray-700 dark:text-gray-200"
                label={t("UI.labels.surname")}
                labelPlacement="outside"
                name="surname"
                placeholder={t("UI.placeholders.write_surname")}
                type="name"
                autoCapitalize="words"
                variant="bordered"
                value={user?.surname}
              />
              <Input
                name="number"
                label={t("UI.labels.number")}
                placeholder={t("UI.placeholders.write_number")}
                queryCollectable
                format={numberInputMask}
                isRequired
                endContent={<PhoneNumberHelper />}
              />
              <Input
                name="email"
                label={t("UI.labels.email")}
                placeholder={t("UI.placeholders.write_email")}
                className="text-gray-700 dark:text-gray-200"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {/* <Input
                taggableVisibility
                className="text-gray-700 dark:text-gray-200"
                label={t("UI.labels.password")}
                labelPlacement="outside"
                name="password"
                placeholder={t("UI.placeholders.write_password")}
                type="password"
                variant="bordered"
              />
              <Input
                taggableVisibility
                className="text-gray-700 dark:text-gray-200"
                label={t("UI.labels.password_confirm")}
                labelPlacement="outside"
                name="password_confirm"
                placeholder={t("UI.placeholders.write_password_confirm")}
                type="password"
                variant="bordered"
              /> */}
              <Spacer y={4} />
              <Button className="w-full" color="primary" type="submit">
                {t("UI.buttons.continue")}
              </Button>
            </Form>
            <div className="flex flex-row flex-1 gap-4">
              <div className="flex flex-col flex-1 gap-4 max-w-md">
                <div className="max-w-48">
                  <label
                    data-slot="label"
                    className="flex-shrink-0 max-w-full text-gray-700 dark:text-gray-200 text-small pointer-events-none"
                  >
                    Profile picture
                  </label>
                  <Img
                    src={user?.profile_picture ?? userPicture.src}
                    fallbackSrc={userPicture.src}
                    className="bg-gray-100 dark:bg-gray-500/75 border-2 border-default-200 hover:border-default-400 rounded-xl min-w-8 min-h-8 object-cover aspect-square cursor-pointer"
                    width={192}
                    height={192}
                    alt="Avatar"
                    onClick={onOpen}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Body>
    </>
  );
}

export const getStaticProps = getWebStaticPropsWithMessages;
