import { ReactNode, useRef, useState } from "react";

import clsx from "clsx";
import Cropper, { Area } from "react-easy-crop";


import { chainId } from "@/constants/app";
import { uploadWithToken } from "@/hooks/useData";
import { getCroppedImg } from "@/utils/canvasUtils";
import { blobToFile } from "@/utils/file";

import Drawer from "../Drawer";
import Loading from "../Loading";


interface IUploadProps {
  extensions?: string[];
  fileLimit?: string;
  className?: string;
  needCrop?: boolean;
  children?: ReactNode;
  aspect?: number;
  onFinish?(url: string): void;
}

const readFile = (file: File) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
};

const Upload = ({
  className,
  needCrop,
  aspect,
  children,
  onFinish,
}: IUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [cropping, setCropping] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>();
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImage, setCroppedImage] = useState<Blob | null>();
  const [croppedImageUrl, setCropedImageUrl] = useState<string>();

  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      if (croppedImage) {
        const file = blobToFile(croppedImage);
        setCropedImageUrl(URL.createObjectURL(croppedImage));
        setCroppedImage(croppedImage);
        handleUpload(file);
        setCropping(false);
        setImageSrc("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = () => {
    if (!loading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = (await readFile(file)) as string;
      setImageSrc(imageDataUrl);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (needCrop) {
        setCropping(true);
      } else {
        handleUpload(file);
      }
    }
  };

  const handleUpload = async (file: File) => {
    try {
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("chainId", chainId);
      setLoading(true);
      const { code, data } = await uploadWithToken(
        "/api/app/file/upload",
        formData
      );
      if (code === "20000") {
        onFinish?.(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        data-testid="confirm-button"
        className={clsx(
          "relative w-full h-[111px] bg-tertiary flex flex-col items-center justify-center rounded-[12px] cursor-pointer overflow-hidden",
          className
        )}
        onClick={handleClick}
      >
        {imageSrc || croppedImage ? (
          <img
            src={imageSrc || croppedImageUrl}
            className="w-full h-full object-cover"
            alt="Banner"
          />
        ) : children ? (
          children
        ) : (
          <i className="votigram-icon-back text-[24px]" />
        )}
        <input
          role="textbox"
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".png, .jpg, .jpeg"
          onChange={handleFileChange}
        />

        {loading && (
          <Loading className="absolute top-0 left-0 right-0 bottom-0 z-10" />
        )}
      </div>
      <Drawer
        isVisible={cropping}
        direction="bottom"
        onClose={() => setCropping(false)}
        rootClassName="bg-tertiary h-screen rounded-none"
      >
        <div className="relative w-full h-full">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            rotation={rotation}
            onCropChange={setCrop}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
          <div className="p-4 absolute right-0 z-10 top-telegramHeader">
            <button
              type="button"
              className="py-2 px-4 bg-primary text-white rounded-[8px] hover:bg-primary-hover"
              onClick={showCroppedImage}
            >
              Confirm
            </button>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Upload;
