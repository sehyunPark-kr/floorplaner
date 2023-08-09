import BackHandIcon from '@mui/icons-material/BackHand';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { type MouseEvent, useEffect, useState } from 'react';

import { FloorplanerMode } from 'src/core/Constants';
import { ObservableManager } from 'src/core/Manager/ObservableManager';

import type { ZED2D } from 'src/core/ZED2D';

interface ModeButtonsProps {
  zed2D: ZED2D;
}
export default function ModeButtons({ zed2D }: ModeButtonsProps) {
  const [mode, setMode] = useState<string | null>('move');

  const handleMode = (event: MouseEvent<HTMLElement>, newMode: string | null) => {
    console.log('newMode', newMode);

    if (newMode) {
      setMode(newMode);
      switch (newMode) {
        case 'move':
          zed2D.switchMode(FloorplanerMode.MOVE);
          break;
        case 'draw':
          zed2D.switchMode(FloorplanerMode.DRAW);
          break;
      }
    }
  };

  useEffect(() => {
    if (!zed2D) return;

    ObservableManager.instance.onChangeMode.add((prop) => {
      switch (prop.mode) {
        case FloorplanerMode.MOVE:
          setMode('move');
          break;
        case FloorplanerMode.DRAW:
          setMode('draw');
          break;
      }
    });
  }, [zed2D]);

  return (
    <ToggleButtonGroup value={mode} exclusive onChange={handleMode} aria-label="select mode">
      <ToggleButton value="move" aria-label="move mode">
        <BackHandIcon />
      </ToggleButton>
      <ToggleButton value="draw" aria-label="draw mode">
        <ModeEditIcon />
      </ToggleButton>
      <ToggleButton value="door" aria-label="door mode" disabled>
        <MeetingRoomIcon />
      </ToggleButton>
      <ToggleButton value="light" aria-label="light mode" disabled>
        <LightbulbIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
