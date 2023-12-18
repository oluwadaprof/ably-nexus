import React from "react";
import { usePresence, assertConfiguration } from "@ably-labs/react-hooks";
// import styles from "";

interface Participant {
  clientId: string;
}

const Participants: React.FC = () => {
  const ably = assertConfiguration();
  const [presenceData] = usePresence("headlines");

  const presenceList = presenceData.map(
    (member: Participant, index: number) => {
      const isItMe = member.clientId === ably.auth.clientId ? "(me)" : "";

      

      return (
        <li key={index} >
          <span >{member.clientId}</span>
          <span >{isItMe}</span>
        </li>
      );
    }
  );

  return <ul>{presenceList}</ul>;
};

export default Participants;
