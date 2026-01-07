import Marquee from "react-fast-marquee";

const TopNotice = () => {
  const notice = import.meta.env.VITE_NOTICE
    ? import.meta.env.VITE_NOTICE.split("-").join(" ")
    : null;

  if (!notice) return null;

  return (
    <div className="bg-yellow-400 text-sm font-medium">
      <Marquee speed={50} gradient={false}>
        <span className="text-white">{notice}</span>
      </Marquee>
    </div>
  );
};

export default TopNotice;
