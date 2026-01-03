import { CardCategory, categoryInfo } from '@/types/businessCard';
import { motion } from 'framer-motion';

interface CelebrationSelectorProps {
  onSelect: (category: CardCategory) => void;
}

const categories: CardCategory[] = ['wedding', 'baby', 'prayer', 'memorial', 'graduation', 'anniversary'];

export const CelebrationSelector = ({ onSelect }: CelebrationSelectorProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground mb-4">
          What are we celebrating?
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Create a stunning metal keepsake card for life's most precious moments
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl w-full">
        {categories.map((category, index) => {
          const info = categoryInfo[category];
          return (
            <motion.button
              key={category}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => onSelect(category)}
              className="group relative p-6 md:p-8 rounded-2xl border-2 border-border bg-card hover:border-primary/50 hover:bg-accent/30 transition-all duration-300"
            >
              <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {info.icon}
              </div>
              <h3 className="text-lg md:text-xl font-medium text-foreground mb-1">
                {info.name}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                {info.description}
              </p>
              
              {/* Subtle shine effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.button>
          );
        })}
      </div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-sm text-muted-foreground"
      >
        Premium metal cards • Pack of 55 • Shipped to your door
      </motion.p>
    </div>
  );
};
