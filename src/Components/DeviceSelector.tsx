"use client";

import React from "react";
import styled from "styled-components";
import { Button } from "@/src/Components/Button";
import { useAppDispatch, useAppSelector } from "@/src/libs/hook";
import { setCurrentDevice } from "@/src/libs/features/websiteBuilder/globalSettingsSlice";
import { selectCurrentDevice } from "@/src/libs/features/websiteBuilder/globalSelect";

type DeviceType = "desktop" | "tablet" | "mobile";

const DeviceSelectorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem;
  border-radius: 4px;
  background-color: ${(props) => props.theme.colors.background};
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  color: ${(props) => props.theme.colors.text};
  &:hover {
    background-color: ${(props) => props.theme.button.hover.primary};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DeviceSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentDevice = useAppSelector(selectCurrentDevice);

  const handleDeviceChange = (newDevice: DeviceType) => {
    dispatch(setCurrentDevice(newDevice));
  };

  return (
    <DeviceSelectorContainer>
      <IconButton
        aria-label="Desktop"
        onClick={() => handleDeviceChange("desktop")}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M17.5 16h-11A1.502 1.502 0 0 1 5 14.5v-8A1.502 1.502 0 0 1 6.5 5h11A1.502 1.502 0 0 1 19 6.5v8a1.502 1.502 0 0 1-1.5 1.5ZM6.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.501.501 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-11ZM16 18H8v1h8v-1Z"></path>
        </svg>
      </IconButton>
      <IconButton
        aria-label="Tablet"
        onClick={() => handleDeviceChange("tablet")}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M15.5 19h-7A1.502 1.502 0 0 1 7 17.5v-11A1.502 1.502 0 0 1 8.5 5h7A1.502 1.502 0 0 1 17 6.5v11a1.502 1.502 0 0 1-1.5 1.5Zm-7-13a.5.5 0 0 0-.5.5v11a.501.501 0 0 0 .5.5h7a.501.501 0 0 0 .5-.5v-11a.5.5 0 0 0-.5-.5h-7Z"></path>
        </svg>
      </IconButton>
      <IconButton
        aria-label="Mobile"
        onClick={() => handleDeviceChange("mobile")}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M17.5 16h-11A1.502 1.502 0 0 1 5 14.5v-8A1.502 1.502 0 0 1 6.5 5h11A1.502 1.502 0 0 1 19 6.5v8a1.502 1.502 0 0 1-1.5 1.5ZM6.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.501.501 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-11ZM16 18H8v1h8v-1Z"></path>
        </svg>
      </IconButton>
    </DeviceSelectorContainer>
  );
};

export default DeviceSelector;
