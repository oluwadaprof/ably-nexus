"use client";

import GridExample from "@/components/grid";
import { configureAbly } from "@ably-labs/react-hooks";
import { AblyProvider } from "ably/react";
import { nanoid } from "nanoid";
import { Realtime } from "ably";
import Spaces from "@ably/spaces";
import { SpaceProvider, SpacesProvider } from "@ably/spaces/react";
import { getSpaceNameFromUrl } from "../../utils/helper";
import AvatarStack from "@/components/avatar/AvatarStack";

const spaceName = getSpaceNameFromUrl();

configureAbly({
  authUrl: `${process.env.NEXT_PUBLIC_HOSTNAME}/api/createTokenRequest`,
});

const client = new Realtime.Promise({
  key: `${process.env.NEXT_PUBLIC_ABLY_API_KEY}`,
  clientId: nanoid(),
});
const spaces = new Spaces(client);

export default function Home() {
  return (
    <main className="h-full w-full">
      {/* The AG Grid component */}
      <AblyProvider client={client}>
        <SpacesProvider client={spaces}>
          <SpaceProvider name={spaceName}>
            <AvatarStack />
            <GridExample spaces={spaces} />
          </SpaceProvider>
        </SpacesProvider>
      </AblyProvider>
      {/* <Participants/> */}
    </main>
  );
}
