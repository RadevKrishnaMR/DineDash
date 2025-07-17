import { motion } from "framer-motion";
import type { MouseEventHandler } from "react";

interface CardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const Card = ({ title, value, icon, color, onClick }: CardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={`bg-white rounded-xl shadow-md p-6 cursor-pointer border-l-4 ${color}`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </motion.div>
  );
};

export default Card;