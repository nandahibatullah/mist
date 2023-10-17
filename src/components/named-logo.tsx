import Logo from "~/components/logo";

export const NamedLogo = () => {
  return (
    <div className="grid grid-flow-col items-center gap-2 px-4 py-4">
      <Logo height={48} width={48} />
      <p className="font-extrabold tracking-tight text-white sm:text-[4rem]">
        MIST
      </p>
    </div>
  );
};
