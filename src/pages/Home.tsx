import { useCallback, useEffect, useState } from "react";
import useFetch from "react-fetch-hook";
import { FiGrid, FiCoffee } from "react-icons/fi";
import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Spacer,
  Stack,
  Tag as TagChakra,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";

import type { Stream } from "../types/stream.types";
import type { Tag } from "../types/tag.types";

import LandingLayout from "../components/layouts/LandingLayout";
import { SkeletonListCard } from "../components/sections/SkeletonListCard";
import { SkeletonListTags } from "../components/sections/SkeletonListTags";
import Card from "../components/ui/Card";
import Mosaic from "../components/sections/Mosaic";

export default function Home() {
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" });

  const [isMosaicMode, setIsMosaicMode] = useState(false);
  const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<Array<string>>([]);
  const [filteredStreamers, setFilteredStreamers] = useState<Stream[]>([]);

  const tags = useFetch<Tag[]>("https://brstreamers.dev:8000/public/tags");
  const streamers = useFetch<Stream[]>(
    "https://brstreamers.dev:8000/public/streams",
  );
  const vods = useFetch<Stream[]>("https://brstreamers.dev:8000/public/vods");

  const handleStreamToMosaic = (channelName: string) => {
    const stream = selectedStreams.find((stream) => stream === channelName);
    if (stream) {
      setSelectedStreams(selectedStreams.filter((item) => item !== stream));
    } else {
      setSelectedStreams([...selectedStreams, channelName]);
    }
  };

  const handleTagClick = (tag: Tag) => {
    if (selectedTags.includes(tag.id)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag.id]);
    }
  };

  const filterByTags = useCallback(
    (tags: string[]) => {
      if (tags.length > 0) {
        const filteredStreams = streamers.data?.filter((streamer) => {
          return tags.every((tag) => streamer.tags?.includes(tag));
        });
        setFilteredStreamers(filteredStreams ?? []);
      } else {
        setFilteredStreamers(streamers.data ?? []);
      }
    },
    [streamers.data],
  );

  useEffect(() => {
    setFilteredStreamers(streamers.data ?? []);
  }, [streamers]);

  useEffect(() => {
    filterByTags(selectedTags);
  }, [selectedTags, filterByTags]);

  return (
    <LandingLayout>
      <Flex mt={8} mb={4} gap={2} alignItems="center" wrap="wrap">
        <Box>
          <Heading>Ao vivo</Heading>
          <Text color={"gray.400"}>Prestigie quem está ao vivo!</Text>
        </Box>

        <Spacer />

        <Box>
          <Stack direction="row" spacing={4}>
            <Button
              size={buttonSize}
              leftIcon={<FiGrid />}
              bgColor={isMosaicMode ? "#8B3DFF" : "gray.100"}
              color={isMosaicMode ? "gray.100" : "gray.800"}
              rounded={"sm"}
              _hover={{
                bgColor: isMosaicMode ? "#8B3DFF" : "gray.200",
                filter: "brightness(0.98)",
              }}
              onClick={() => setIsMosaicMode(!isMosaicMode)}
            >
              Simultâneo
            </Button>
            <Button
              size={buttonSize}
              variant="solid"
              rounded={"sm"}
              leftIcon={<FiCoffee />}
            >
              Estou com sorte
            </Button>
          </Stack>
        </Box>
      </Flex>

      <Flex
        mb={4}
        wrap={{ base: "nowrap", md: "wrap" }}
        overflow="auto"
        sx={{
          scrollbarWidth: "none",
          "::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-scrollbar-track-color": {
            display: "none",
          },
        }}
      >
        {tags.isLoading ? (
          <SkeletonListTags />
        ) : (
          <>
            {tags.data?.map((tag) => (
              <TagChakra
                flexShrink="0"
                cursor="pointer"
                onClick={() => handleTagClick(tag)}
                key={tag.id}
                m={1}
                rounded={"sm"}
                color={selectedTags.includes(tag.id) ? "gray.100" : "gray.300"}
                bgColor={selectedTags.includes(tag.id) ? "#8B3DFF" : "gray.800"}
              >
                {tag.name}
              </TagChakra>
            ))}
          </>
        )}
      </Flex>
      {streamers.isLoading ? (
        <SkeletonListCard />
      ) : (
        <SimpleGrid columns={{ sm: 2, md: 3, lg: 4 }} gap={4}>
          {filteredStreamers.map((stream) => (
            <Card
              key={stream.id}
              stream={stream}
              isLive={true}
              isMosaicMode={isMosaicMode}
              handleStreamToMosaic={handleStreamToMosaic}
            />
          ))}
        </SimpleGrid>
      )}

      <Box mt={16} mb={4}>
        <Heading>Transmissões passadas</Heading>
        <Text color={"gray.400"}>Veja o que deixaram gravado!</Text>
      </Box>
      {vods.isLoading ? (
        <SkeletonListCard />
      ) : (
        <SimpleGrid columns={{ sm: 2, md: 3, lg: 4 }} gap={4}>
          {vods.data?.map((stream) => (
            <Card
              key={stream.id}
              stream={stream}
              isLive={false}
              isMosaicMode={false}
            />
          ))}
        </SimpleGrid>
      )}

      {isMosaicMode && <Mosaic channels={selectedStreams} />}
    </LandingLayout>
  );
}