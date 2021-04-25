import React, { useState } from "react";
import md5 from "md5"
import styled from "styled-components";

const Body = styled.div`
  color: white;
`;

export default function Test() {
  const [encrypted, setEncrypted] = useState();
  const [sync, setSync] = useState();
  const [isSame, setIsSame] = useState();

  const handleEncrypt = async (e) => {
    e.preventDefault();
    var hash = await md5(e.target[0].value)
    setEncrypted(hash);
  };

  const handleSync = async (e) => {
    e.preventDefault();
    var hash = await md5(e.target[0].value)
    setSync(hash);
    var compare = encrypted === hash;
    setIsSame(`${compare}`);
  };

  return (
    <Body>
      <form id="encrypt" onSubmit={handleEncrypt}>
        <label htmlFor="tobeCrypt">TobeHash</label>
        <input type="text" name="tobeCrypt" id="tobeCrypt" required />
      </form>
      <form id="sync" onSubmit={handleSync}>
        <label htmlFor="tobeSync">TobeSync</label>
        <input type="text" name="tobeSync" id="tobeSync" required />
      </form>
      <button type="submit" form="encrypt">
        Hash
      </button>
      <button type="submit" form="sync" disabled={encrypted ? false : true}>
        Sync
      </button>
      <br />
      <p>Encrypted log: {encrypted}</p>
      <p>Sync log: {sync}</p>
      <p>isCompareSame: {isSame}</p>
    </Body>
  );
}
