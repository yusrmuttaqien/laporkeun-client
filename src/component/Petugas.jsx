import React, { useState } from "react";
import styled from "styled-components";

import {
  ReportWrapper,
  Action,
  Report,
  ReportBody,
  Button,
  Label,
  Input,
  Warning,
  CustomSelect,
} from "style/Components";
import { options } from "util/Fetches";
import PetugasRegistrasi from "component/PetugasRegistrasi";
import { UIInstance } from "util/States";

export default function Petugas(props) {
  const [isRegis, setIsRegis] = useState(false);

  const optionChange = (option) => {};

  const isRegisterSwitch = () => {
    setIsRegis((prev) => !prev);
  };

  return (
    <ReportWrapper>
      <Report>
        <div className="reportHeader">
          <h1 title={props.name}>{props.name}</h1>
          <div className="multiOption">
            <CustomSelect
              options={options}
              classNamePrefix={"Select"}
              defaultValue={options[0]}
              placeholder="Urutkan dari"
              onChange={optionChange}
            />
            <Button onClick={isRegisterSwitch}>
              {isRegis ? "Kembali" : "Tambah petugas"}
            </Button>
          </div>
        </div>
        {isRegis ? <PetugasRegistrasi /> : "halo"}
      </Report>
    </ReportWrapper>
  );
}
