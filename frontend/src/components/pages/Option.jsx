import React from "react";

const Option = ({
  option,
  isSelected,
  isCorrect,
  isWrong,
  isAnswered,
  isValidating,
  onClick,
}) => {
  const handleClick = () => {
    if (!isAnswered && !isValidating) {
      onClick(option);
    }
  };

  let baseStyle =
    "btn justify-start w-full flex items-center gap-2 text-base font-medium transition-colors duration-300";

  if (!isAnswered) {
    baseStyle += " btn-outline"; // Before answering
  } else {
    if (isCorrect) {
      baseStyle += " bg-green-500 text-white hover:bg-green-600"; // Correct
    } else if (isWrong) {
      baseStyle += " bg-red-500 text-white hover:bg-red-600"; // Wrong
    } else {
      baseStyle += " btn-outline"; // Other unselected
    }
  }


  return (
    <button className={baseStyle} onClick={handleClick}>
      <span>{option.value}</span>
      {isValidating && (
        <span className="loading loading-spinner loading-xs ml-2"></span>
      )}
    </button>
  );
};

export default Option;
