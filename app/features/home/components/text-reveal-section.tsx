import { TextReveal } from '~/components/magicui/text-reveal';

const TextRevealSection = () => {
  return (
    <section className="dark my-0 bg-background ">
      <div className=" flex flex-col items-center justify-center">
        <TextReveal className="font-medium">
          Genii adalah AI companion yang dirancang khusus buat mempercepat
          perjalanan karir tech kamu di Indonesia. Dapetin jalur belajar
          personal, bantuan instant dari AI tutor, dan praktek langsung yang
          bikin skill kamu nyata.
        </TextReveal>
      </div>
    </section>
  );
};

export { TextRevealSection };
