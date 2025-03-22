import React from "react";
//import { useAuth } from "../hooks/useAuth";
import { AvatarCreator, AvatarCreatorConfig, AvatarExportedEvent } from '@readyplayerme/react-avatar-creator';

const Demo: React.FC = () => {
  //const { user } = useAuth();

  const config: AvatarCreatorConfig = {
    clearCache: true,
    bodyType: 'fullbody',
    quickStart: false,
    language: 'en',
  };
  
  const style = { width: '100%', height: '100vh', border: 'none' };
  
  const handleOnAvatarExported = (event: AvatarExportedEvent) => {
      console.log(`Avatar URL is: ${event.data.url}`);
  };

  return (
    <>
      {/* <AvatarCreator subdomain="virtuhireai" config={config} style={style} onAvatarExported={handleOnAvatarExported} /> */}
      <AvatarCreator subdomain="demo" config={config} style={style} onAvatarExported={handleOnAvatarExported} /> 
    </>
  );
};

export default Demo;
