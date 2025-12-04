import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";


import "swiper/css";
import "swiper/css/pagination";

import "./index.css";

interface IImageCarouselProps {
  className?: string;
  items: string[];
}

const ImageCarousel = ({ className, items }: IImageCarouselProps) => {
  return (
    <Swiper
      slidesPerView={"auto"}
      centeredSlides={true}
      spaceBetween={30}
      pagination={{
        clickable: true,
      }}
      className={className}
      modules={[Pagination]}
      onActiveIndexChange={() => {
        window.Telegram.WebApp.HapticFeedback.impactOccurred("light");
      }}
    >
      {items?.map((item: string) => (
        <SwiperSlide key={item}>
          <img className="max-h-full" src={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageCarousel;
