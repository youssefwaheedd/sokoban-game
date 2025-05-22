import React from "react";
import { CellProps } from "../constants/interfaces/game";
import Wall from "./cell-components/Wall";
import Box from "./cell-components/Box";
import Player from "./cell-components/Player";
import Target from "./cell-components/Target";
import BoxOnTarget from "./cell-components/BoxOnTarget";
import Floor from "./cell-components/Floor";

const Cell = ({ type }: CellProps) => {
  let content: React.ReactNode;

  switch (type) {
    case "W": // Wall
      content = <Wall />;
      break;
    case "B": // Box
      content = <Box />;
      break;
    case "P": // Player
      content = <Player />;
      break;
    case "T": // Target
      content = <Target />;
      break;
    case "*": // Box on target
      content = <BoxOnTarget />;
      break;
    default: // Floor
      content = <Floor />;
      break;
  }

  return content;
};

export default Cell;
