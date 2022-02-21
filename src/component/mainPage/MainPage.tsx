import StreamerList from "../streamerList/StreamerList";
import BottomBar from "../bottombar/BottomBar";
import Sidebar from "../sidebar/Sidebar";
import './MainPage.css';
import Header from "../header/Header";
import {
  Center,
  chakra,
  Container,
  Divider,
  Grid,
  GridItem,
  Spinner,
  Text,
} from "@chakra-ui/react";
import VodList from "../vodList/VodList";
import React from "react";

export default function MainPage() {
    const [isReloading, setReloading] = React.useState(false);
    const [streamingUrls, setStreamingUrls] = React.useState([""]);
  
    const handleReloading = (reloading: boolean) => {
      setReloading(reloading);
    };
  
    const handleStreamingUrls = (streamingUrls: string[]) => {
      setStreamingUrls(streamingUrls);
    };
  

    return (
        <>
        <Grid templateColumns="repeat(5, 1fr)" gap={6}>
          <GridItem w="100%">
            <chakra.div className="sidebar-desktop">
              <Sidebar streamingUrls={streamingUrls}></Sidebar>
            </chakra.div>
          </GridItem>
          <GridItem colSpan={5} w="100%">
            <Header title="Br Dev Streamers" subtitle="Somos todos uma comunidade"></Header>
            
            <Container maxW="container.lg">
              <Center mt="50px">
                <Text
                  id="lives"
                  lineHeight="7"
                  p="2"
                  borderRadius="6"
                  className="category-title"
                  fontSize="3xl"
                >
                  Lives
                  {isReloading && (
                    <Spinner size="sm" ml="2" color="primary.400" />
                  )}
                </Text>
              </Center>
              <Center>
                <chakra.h4 mt="0" lineHeight="6">
                  Prestigie quem está ao vivo
                </chakra.h4>
              </Center>
            </Container>
            <Container mt="5" maxW="container.lg">
              <StreamerList
                setStreamingUrls={handleStreamingUrls}
                setReloading={handleReloading}
              ></StreamerList>
            </Container>

            <Container mt="8" maxW="container.lg">
              <Divider mt="4" mb="8"></Divider>
              <Center>
                <Text
                  id="vods"
                  lineHeight="7"
                  p="2"
                  borderRadius="6"
                  className="category-title"
                  fontSize="3xl"
                >
                  Vods
                </Text>
              </Center>
              <Center>
                <chakra.h4 mt="0" lineHeight="6">
                  Veja o que deixaram gravado
                </chakra.h4>
              </Center>
            </Container>
            <Container mt="5" mb="5" maxW="container.lg">
              <VodList></VodList>
            </Container>
            
            <Center className="mobile-footer">
              <Container height="10" maxW="container.xl">
                <BottomBar streamingUrls={streamingUrls}></BottomBar>
              </Container>
            </Center>
          </GridItem>
        </Grid>
        </>
    )
}