import React, { useRef } from "react";
import styled from "styled-components";
import { useStoreState, useStoreActions } from "easy-peasy";
import { Action, Button, Label, TextArea } from "./GlobalStyling";

import DefaultImg from "./../asset/defaultReport.jpg";

const SideDetailsWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1001;
  transform: ${(props) =>
    props.focus ? "translateX(0%)" : "translateX(100%)"};

  height: inherit;
  min-height: inherit;
  width: ${(props) => props.theme.value.UI.sideDetails};
  padding: 20px 30px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background-color: ${(props) => props.theme.color.darkTransparent};
  backdrop-filter: blur(${(props) => props.theme.value.blur});
  transition: ${(props) => props.theme.value.transition};
  color: ${(props) => props.theme.color.white};
`;

const Control = styled.div`
  display: flex;
  justify-content: space-between;

  height: fit-content;
`;

const Header = styled.div`
  /* background-color: green; */

  height: 30%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  img {
    align-self: center;

    height: 70%;
    max-width: 100%;

    object-fit: contain;
    border-radius: ${(props) => props.theme.value.radius};
  }

  section {
    h2 {
      font-weight: ${(props) => props.theme.value.font.normal};
    }

    p {
      font-weight: ${(props) => props.theme.value.font.light};
    }
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  height: 60%;

  section {
    &:nth-child(1) {
      height: 45%;

      overflow: auto;

      p {
        font-weight: ${(props) => props.theme.value.font.light};
        text-align: justify;

        height: inherit;
      }
    }

    &:nth-child(2) {
      display: flex;
      flex-direction: column;

      height: 50%;
    }
  }
`;

const CustomButton = styled(Button)`
    font-size: .85rem;
`

export default function SideDetails() {
  const Focus = useStoreState((state) => state.UI.sideDetails.onFocus);
  const test = useStoreActions((actions) => actions.toggleFocusDetails);

  const Blur = useRef();

  return (
    <SideDetailsWrapper
      onBlur={() => test()}
      focus={Focus}
      tabIndex="0"
      ref={Blur}
    >
      <Control>
        <Action onClick={() => Blur.current.blur()} title="Tutup Detail">
          <span className="material-icons">logout</span>
        </Action>
        <CustomButton>unduh laporan</CustomButton>
      </Control>
      <Header>
        <img src={DefaultImg} alt="Foto laporan" />
        <section>
          <h2>judul laporan</h2>
          <p>03/10/2020 - Publik - Diterima</p>
        </section>
      </Header>
      <Body>
        <section>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum modi
            suscipit, nostrum sunt eveniet aperiam accusantium odio doloribus
            explicabo vero vitae iste? Neque, in cumque? Unde praesentium
            incidunt possimus voluptatibus minima quod, dolor in cumque minus
            voluptatem eligendi, harum at temporibus. Pariatur placeat nihil
            aliquam dicta cum illum eius nisi consequatur voluptatem? Maiores
            possimus laudantium in minima et modi, obcaecati deserunt quisquam
            ipsum perspiciatis odio autem doloremque quidem perferendis eaque
            deleniti nemo provident tempora aspernatur ipsam dicta, ab
            asperiores iste. Id assumenda debitis sint autem veritatis
            cupiditate delectus velit natus ad quas voluptas, maxime cum
            aspernatur repellat, nesciunt quos at aperiam mollitia eius suscipit
            ipsum vel dolores earum. Delectus vel doloribus modi animi commodi.
            Eveniet reprehenderit quia facilis a dolorem eum reiciendis commodi
            dolore nostrum unde explicabo molestiae, ab sunt inventore officiis,
            tempora nobis illo quasi id maxime itaque provident sequi pariatur?
            Alias maxime error nam tenetur. Animi cum consequatur velit
            perspiciatis natus est repudiandae, deleniti nihil veniam blanditiis
            expedita, soluta illo dignissimos fuga necessitatibus itaque nam
            commodi cumque. Repudiandae consequuntur nobis tenetur repellendus
            sunt facere aliquam esse ad unde accusantium minima voluptatum
            rerum, quibusdam pariatur nam eligendi amet saepe dignissimos cumque
            officiis minus. Laboriosam, soluta at amet in, repudiandae doloribus
            quam sunt similique laudantium esse cumque voluptas qui. Quis unde
            eos, quisquam, perspiciatis quo iure ipsa natus culpa eligendi
            dolor, suscipit aliquid tenetur ut illo non numquam nam ab aliquam
            provident! Placeat veritatis quisquam neque ea hic laboriosam cumque
            animi vel quis facilis, beatae accusantium enim non iure incidunt
            asperiores obcaecati vero dolore, natus architecto dolorum facere
            sed nisi sapiente. Ab atque exercitationem ipsam dignissimos non,
            consequatur voluptatum amet magni aspernatur, quis ea fuga
            temporibus praesentium quod ipsa debitis velit? Ipsum alias
            similique laboriosam! Officiis fugiat dolorum consectetur tempora,
            voluptates unde laudantium quis repudiandae cum neque reiciendis
            eveniet? Necessitatibus eaque voluptatem inventore cum. Nisi
            voluptate ea voluptatem eaque, reiciendis officia natus error ipsam
            enim soluta animi eligendi! Distinctio quod dolore, cum adipisci
            fuga esse sequi quibusdam, corporis cumque aperiam incidunt vel modi
            voluptatum voluptate doloribus perspiciatis atque minus. Accusamus
            dicta deserunt maiores illo ducimus perspiciatis, obcaecati,
            provident explicabo ratione quasi nisi at a eum praesentium velit ea
            odio commodi recusandae ipsa corrupti sit. Maxime libero amet
            corrupti, adipisci iure expedita vitae blanditiis eum. Quis ut ab,
            illo dignissimos alias aliquam eaque dolorum eligendi assumenda,
            architecto officiis natus cumque accusamus sunt illum! Tenetur
            consequatur suscipit tempora corporis ad error fugiat omnis dolorum
            dicta nemo molestias officiis, blanditiis adipisci harum quibusdam
            ab voluptatibus laudantium? Omnis recusandae nihil accusamus
            laboriosam ab. Unde minima, delectus doloremque impedit fugiat
            voluptatibus omnis in sint et officia aliquid sit quisquam facilis,
            ut quam ad dolorum eos ex incidunt laborum consequatur voluptas!
            Inventore, beatae accusamus ipsam libero soluta esse facere, et
            doloremque labore aut ex dolorum quaerat? Hic accusamus repellendus
            eaque omnis quae, accusantium facere blanditiis aut laborum iure
            deserunt tempora tempore nam minima laudantium ullam, perferendis
            cum dolore iusto a earum molestiae in delectus. In debitis incidunt
            iure quod. Velit, alias animi. Odio quibusdam dignissimos sunt.
          </p>
        </section>
        <section>
          <Label htmlFor="responBalik">respon balik</Label>
          <TextArea></TextArea>
          <Button>kirim respon</Button>
        </section>
      </Body>
    </SideDetailsWrapper>
  );
}
