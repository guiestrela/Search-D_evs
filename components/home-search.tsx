"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  HStack,
  Text,
  VStack
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";

export function HomeSearch() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [username, setUsername] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      return;
    }

    setUsername("");
    router.push(`/profile/${encodeURIComponent(trimmedUsername)}`);
  };

  return (
    <>
      <Flex minH="100vh" align={{ base: "start", md: "center" }} justify="center" px={{ base: 4, md: 6 }} pt={{ base: 44, md: 0 }}>
      <VStack spacing={{ base: 8, md: 10 }} w="full" maxW="800px" minH={{ base: "auto", lg: "213px" }}>
        <Heading
          as="h1"
          textAlign="center"
          fontFamily="var(--font-nunito), sans-serif"
          fontSize="80px"
          lineHeight="100%"
          letterSpacing="0.01em"
          sx={{ wordSpacing: "0.01em" }}
          fontWeight="500"
          color="#0B69C7"
        >
          <Box as={Link} href="/home" _hover={{ textDecoration: "none" }}>
            Search <Box as="span" color="#8A2BE2">d_evs</Box>
          </Box>
        </Heading>

        <Box as="form" onSubmit={onSubmit} w="full" className="home-search-layout home-mobile-search-layout">
          <VStack align="stretch" spacing={2}>
            <Text fontSize="14px" color="#2D3748" ml={2} display={{ base: "block", md: "none" }}>
              Label
            </Text>
          </VStack>

          <HStack align="stretch" spacing={4}>
            <InputGroup size="lg" flex="1">
              <InputLeftElement pointerEvents="none">
                <Icon as={SearchIcon} color="gray.400" />
              </InputLeftElement>
              <Input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Search"
                h={{ base: "50px", md: "48px" }}
                border="1px solid"
                borderColor="#9CA3AF"
                borderRadius="6px"
                bg="white"
                _hover={{ borderColor: "#8A2BE2" }}
                _focusVisible={{ borderColor: "#8A2BE2", boxShadow: "0 0 0 1px #8A2BE2" }}
              />
            </InputGroup>

            <Button
              type="submit"
              className="home-search-button"
              minW="124px"
              h="46px"
              borderRadius="6px"
              display="inline-flex"
              bg="linear-gradient(180deg, #922FE4 0%, #7D22D2 100%)"
              color="white"
              fontFamily="var(--font-inter), sans-serif"
              fontWeight="600"
              fontSize="18px"
              lineHeight="28px"
              letterSpacing="0"
              _hover={{ bg: "linear-gradient(180deg, #8428CC 0%, #6F1FB7 100%)" }}
            >
              {t("searchButton")}
            </Button>
          </HStack>
        </Box>
      </VStack>
      </Flex>
    </>
  );
}
