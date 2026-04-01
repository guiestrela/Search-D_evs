"use client";

import {
  Avatar,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Container,
  Flex,
  Heading,
  HStack,
  Link as ChakraLink,
  Icon,
  Spinner,
  Stack,
  Text,
  VStack,
  Button
} from "@chakra-ui/react";
import { SearchIcon, StarIcon } from "@chakra-ui/icons";
import type { IconType } from "react-icons";
import { FiBriefcase, FiHeart, FiLink, FiMail, FiMapPin, FiTwitter, FiUsers } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import {
  fetchGithubRepoReadmeSummary,
  fetchGithubRepos,
  fetchGithubUser,
  GithubUserNotFoundError
} from "@/lib/api/github";
import type { GithubRepo, GithubUser } from "@/lib/schemas/github";

type ProfileViewProps = {
  username: string;
};

type LoadState = "loading" | "loaded" | "not-found" | "error";

export function ProfileView({ username }: ProfileViewProps) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [state, setState] = useState<LoadState>("loading");
  const [user, setUser] = useState<GithubUser | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [repoReadmeSummaries, setRepoReadmeSummaries] = useState<Record<number, string>>({});

  const onSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchValue.trim();
    if (!trimmed) {
      return;
    }

    setSearchValue("");
    router.push(`/profile/${encodeURIComponent(trimmed)}`);
  };

  const repoUpdatedLabel = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(date);
  };

  const extractLinkedInUrl = (blog?: string | null, bio?: string | null) => {
    // Check blog field first
    if (blog && blog.includes("linkedin.com")) {
      return blog;
    }
    // Check bio for LinkedIn URL
    if (bio) {
      const linkedInMatch = bio.match(/(https?:\/\/(?:www\.)?linkedin\.com\/(?:in|company)\/[^\s]+)/i);
      if (linkedInMatch) {
        return linkedInMatch[0];
      }
    }
    return null;
  };

  const getLinkedInUrl = useMemo(() => {
    if (!user) return null;
    return extractLinkedInUrl(user.blog, user.bio);
  }, [user]);

  const profileLinksWithData = useMemo(
    () => {
      const items: Array<{ label: string; icon: IconType; value: string; url?: string }> = [];
      
      if (user?.company) {
        items.push({ label: user.company, icon: FiBriefcase, value: "company" });
      }
      if (user?.location) {
        items.push({ label: user.location, icon: FiMapPin, value: "location" });
      }
      if (user?.email) {
        items.push({ label: user.email, icon: FiMail, value: "email" });
      }
      
      // LinkedIn
      const linkedInUrl = getLinkedInUrl;
      if (linkedInUrl) {
        items.push({ 
          label: "LinkedIn", 
          icon: FaLinkedin, 
          value: "linkedin",
          url: linkedInUrl
        });
      }
      
      // Blog (show if not LinkedIn)
      if (user?.blog && !linkedInUrl) {
        items.push({ 
          label: user.blog, 
          icon: FiLink, 
          value: "blog",
          url: user.blog
        });
      } else if (user?.blog && linkedInUrl && user.blog !== linkedInUrl) {
        // Show blog even if LinkedIn exists
        items.push({ 
          label: user.blog, 
          icon: FiLink, 
          value: "blog",
          url: user.blog
        });
      }
      
      if (user?.twitter_username) {
        items.push({ label: `@${user.twitter_username}`, icon: FiTwitter, value: "twitter" });
      }
      
      return items;
    },
    [user, getLinkedInUrl]
  );

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setState("loading");
      try {
        const [loadedUser, loadedRepos] = await Promise.all([
          fetchGithubUser(username),
          fetchGithubRepos(username)
        ]);

        if (!isMounted) {
          return;
        }

        setUser(loadedUser);
        setRepos(loadedRepos);
        setState("loaded");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error("Error loading profile:", error);

        if (error instanceof GithubUserNotFoundError) {
          setState("not-found");
          return;
        }

        setState("error");
      }
    }

    void loadData();

    return () => {
      isMounted = false;
    };
  }, [username]);

  useEffect(() => {
    let isMounted = true;

    async function loadReadmeSummaries() {
      if (repos.length === 0) {
        setRepoReadmeSummaries({});
        return;
      }

      const entries = await Promise.all(
        repos.map(async (repo) => {
          const summary = await fetchGithubRepoReadmeSummary(username, repo.name);
          return [repo.id, summary] as const;
        })
      );

      if (!isMounted) {
        return;
      }

      setRepoReadmeSummaries(Object.fromEntries(entries));
    }

    void loadReadmeSummaries();

    return () => {
      isMounted = false;
    };
  }, [repos, username]);

  return (
    <>
      <Flex minH="100vh" align="start" bg="transparent">
      <Container maxW="1260px" py={{ base: 8, md: 6 }}>
        <VStack spacing={5} align="stretch">
          <HStack display={{ base: "none", lg: "flex" }} justify="flex-start" align="center" spacing={10}>
            <Heading
              as="h1"
              fontFamily="var(--font-nunito), sans-serif"
              fontWeight="500"
              fontSize="32px"
              lineHeight="100%"
              letterSpacing="0.01em"
              color="#0B69C7"
              minW="190px"
            >
              <ChakraLink as={NextLink} href="/home" _hover={{ textDecoration: "none" }}>
                Search <Box as="span" color="#8A2BE2">d_evs</Box>
              </ChakraLink>
            </Heading>

            <Box as="form" onSubmit={onSearchSubmit} w="100%" maxW="620px" className="profile-search-layout">
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <Icon as={SearchIcon} color="gray.400" />
                </InputLeftElement>
                <Input
                  className="profile-search-input"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder={t("usernamePlaceholder")}
                  h={{ base: "50px", md: "46px" }}
                  border="1px solid"
                  borderColor="#9CA3AF"
                  borderRadius="6px"
                  bg="white"
                  _hover={{ borderColor: "#8A2BE2" }}
                  _focusVisible={{ borderColor: "#8A2BE2", boxShadow: "0 0 0 1px #8A2BE2" }}
                />
              </InputGroup>
            </Box>
          </HStack>

          {state === "loading" && (
            <HStack justify="center" py={10} spacing={4}>
              <Spinner size="lg" />
              <Text>{t("loading")}</Text>
            </HStack>
          )}

          {state === "not-found" && <Text>{t("notFound")}</Text>}

          {state === "error" && <Text>{t("errorLoadingProfile")}</Text>}

          {state === "loaded" && user && (
            <>
              <Box display={{ base: "block", lg: "none" }}>
                <Box bg="#e7e1f3" p={4} borderRadius="0">
                  <HStack spacing={3} align="start" className="profile-title-photo-block">
                    <Avatar size="md" name={user.name ?? user.login} src={user.avatar_url} />
                    <Box>
                      <Heading
                        size="md"
                        fontFamily="var(--font-inter), sans-serif"
                        fontWeight="700"
                        fontSize="20px"
                        lineHeight="1.15"
                        letterSpacing="0"
                        color="#222831"
                      >
                        {user.name ?? user.login}
                      </Heading>
                      <Text color="#596273" fontSize="3xl">@{user.login}</Text>
                    </Box>
                  </HStack>

                  <HStack mt={3} spacing={0} color="#596273" fontSize="2xl" flexWrap="wrap">
                    <HStack spacing={2}>
                      <Icon as={FiUsers} boxSize={5} />
                      <Text>{user.followers} {t("followers").toLowerCase()}</Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Icon as={FiHeart} boxSize={5} />
                      <Text>{user.following} {t("following").toLowerCase()}</Text>
                    </HStack>
                    <HStack spacing={2} ml="24px">
                      <Icon as={StarIcon} boxSize={5} />
                      <Text>{user.public_repos} repos</Text>
                    </HStack>
                  </HStack>

                  {user.bio && (
                    <Text
                      mt={4}
                      color="#596273"
                      fontFamily="var(--font-inter), sans-serif"
                      fontWeight="400"
                      fontSize="16px"
                      lineHeight="150%"
                      letterSpacing="0"
                    >
                      {user.bio}
                    </Text>
                  )}

                  <VStack
                    align="stretch"
                    spacing={2.5}
                    mt={4}
                    color="#596273"
                    fontFamily="var(--font-inter), sans-serif"
                    fontWeight="400"
                    fontSize="14px"
                    lineHeight="150%"
                    letterSpacing="0"
                  >
                    <HStack spacing={5} align="center" flexWrap="wrap">
                      {user.company && (
                        <HStack spacing={2}>
                          <Icon as={FiBriefcase} boxSize={5} />
                          <Text>{user.company}</Text>
                        </HStack>
                      )}
                      {user.location && (
                        <HStack spacing={2}>
                          <Icon as={FiMapPin} boxSize={5} />
                          <Text>{user.location}</Text>
                        </HStack>
                      )}
                      {user.email && (
                        <HStack spacing={2}>
                          <Icon as={FiMail} boxSize={5} />
                          <Text>{user.email}</Text>
                        </HStack>
                      )}
                    </HStack>

                    <HStack spacing={5} align="center" flexWrap="wrap">
                      {getLinkedInUrl && (
                        <HStack spacing={2}>
                          <Icon as={FaLinkedin} boxSize={5} />
                          <ChakraLink href={getLinkedInUrl} isExternal color="#0B69C7" _hover={{ textDecoration: "underline" }}>
                            LinkedIn
                          </ChakraLink>
                        </HStack>
                      )}
                      {user.blog && !getLinkedInUrl && (
                        <HStack spacing={2}>
                          <Icon as={FiLink} boxSize={5} />
                          <ChakraLink href={user.blog} isExternal color="#0B69C7" _hover={{ textDecoration: "underline" }}>
                            {user.blog}
                          </ChakraLink>
                        </HStack>
                      )}
                      {user.blog && getLinkedInUrl && (
                        <HStack spacing={2}>
                          <Icon as={FiLink} boxSize={5} />
                          <ChakraLink href={user.blog} isExternal color="#0B69C7" _hover={{ textDecoration: "underline" }}>
                            {user.blog}
                          </ChakraLink>
                        </HStack>
                      )}
                      {user.twitter_username && (
                        <HStack spacing={2}>
                          <Icon as={FiTwitter} boxSize={5} />
                          <ChakraLink href={`https://twitter.com/${user.twitter_username}`} isExternal color="#0B69C7" _hover={{ textDecoration: "underline" }}>
                            @{user.twitter_username}
                          </ChakraLink>
                        </HStack>
                      )}
                    </HStack>
                  </VStack>
                </Box>

                <Box mt={4} px={1}>
                  <VStack align="stretch" spacing={0}>
                    {repos.map((repo) => (
                      <Box key={repo.id} py={3} borderBottom="1px solid" borderColor="#DFE4EC">
                        <ChakraLink href={repo.html_url} isExternal color="#222831" fontWeight="700" fontSize="20px" lineHeight="1.15">
                          {repo.name}
                        </ChakraLink>
                        {(repoReadmeSummaries[repo.id] || repo.description) && (
                          <Text
                            mt={2}
                            color="#596273"
                            fontFamily="var(--font-inter), sans-serif"
                            fontWeight="400"
                            fontSize="16px"
                            lineHeight="150%"
                            letterSpacing="0"
                          >
                            {repoReadmeSummaries[repo.id] || repo.description}
                          </Text>
                        )}
                        <HStack spacing={2} mt={3} color="#687385" fontSize="lg">
                          <Icon as={StarIcon} boxSize={3} />
                          <Text>{repo.stargazers_count}</Text>
                          <Text>•</Text>
                          <Text>{t("updatedAt")} {repoUpdatedLabel(repo.updated_at)}</Text>
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              </Box>

              <Stack
                display={{ base: "none", lg: "flex" }}
                direction={{ base: "column", lg: "row" }}
                spacing={8}
                align="start"
                mt={{ base: 0, lg: "80px" }}
              >
              <VStack spacing={6} align="stretch" w={{ base: "full", lg: "292px" }}>
                <Box bg="#ECEFF3" p={5} minH="360px">
                  <HStack spacing={3} align="start">
                    <Avatar size="md" name={user.name ?? user.login} src={user.avatar_url} />
                    <Box>
                      <Heading
                        size="sm"
                        fontFamily="var(--font-inter), sans-serif"
                        fontWeight="700"
                        fontSize="20px"
                        lineHeight="1.15"
                        letterSpacing="0"
                        color="#222831"
                      >
                        {user.name ?? user.login}
                      </Heading>
                      <Text color="#9AA4B2" fontSize="sm">@{user.login}</Text>
                    </Box>
                  </HStack>

                  {user.bio && (
                    <Text
                      mt={4}
                      color="#596273"
                      fontFamily="var(--font-inter), sans-serif"
                      fontWeight="400"
                      fontSize="16px"
                      lineHeight="150%"
                      letterSpacing="0"
                    >
                      {user.bio}
                    </Text>
                  )}

                  <VStack
                    align="start"
                    spacing={2}
                    mt={5}
                    color="#596273"
                    fontFamily="var(--font-inter), sans-serif"
                    fontWeight="400"
                    fontSize="14px"
                    lineHeight="150%"
                    letterSpacing="0"
                  >
                    <VStack align="start" spacing={0}>
                      <HStack spacing={2}>
                        <Icon as={FiUsers} boxSize={4} />
                        <Text>{user.followers} {t("followers").toLowerCase()}</Text>
                      </HStack>
                      <HStack spacing={2}>
                        <Icon as={FiHeart} boxSize={4} />
                        <Text>{user.following} {t("following").toLowerCase()}</Text>
                      </HStack>
                      <HStack spacing={2} mt="24px">
                        <Icon as={StarIcon} boxSize={4} />
                        <Text>{user.public_repos} repos</Text>
                      </HStack>
                    </VStack>
                    {profileLinksWithData.map((item) => (
                      <HStack key={item.value} spacing={2}>
                        <Icon as={item.icon} boxSize={4} />
                        {item.url ? (
                          <ChakraLink href={item.url} isExternal color="#0B69C7" _hover={{ textDecoration: "underline" }}>
                            {item.label}
                          </ChakraLink>
                        ) : (
                          <Text>{item.label}</Text>
                        )}
                      </HStack>
                    ))}
                  </VStack>
                </Box>

                <Button
                  as={ChakraLink}
                  href={user.html_url}
                  isExternal
                  w="full"
                  h="44px"
                  bg="linear-gradient(180deg, #922FE4 0%, #7D22D2 100%)"
                  color="white"
                  borderRadius="6px"
                  _focusVisible={{ boxShadow: "0 0 0 2px #7D22D2" }}
                  _hover={{ bg: "linear-gradient(180deg, #8428CC 0%, #6F1FB7 100%)" }}
                >
                  {t("contact")}
                </Button>
              </VStack>

              <Box flex="1" w="full" bg="#F6F7F9" p={0}>
                {repos.length === 0 && <Text color="#596273">{t("noRepositories")}</Text>}

                <VStack align="stretch" spacing={0}>
                  {repos.map((repo) => (
                    <Box key={repo.id} px={5} py={4} borderBottom="1px solid" borderColor="#DFE4EC">
                      <ChakraLink href={repo.html_url} isExternal color="#222831" fontWeight="700" fontSize="20px" lineHeight="1.15">
                        {repo.name}
                      </ChakraLink>
                      {(repoReadmeSummaries[repo.id] || repo.description) && (
                        <Text
                          mt={2}
                          color="#596273"
                          fontFamily="var(--font-inter), sans-serif"
                          fontWeight="400"
                          fontSize="16px"
                          lineHeight="150%"
                          letterSpacing="0"
                        >
                          {repoReadmeSummaries[repo.id] || repo.description}
                        </Text>
                      )}
                      <HStack spacing={2} mt={3} color="#687385" fontSize="sm">
                        <Icon as={StarIcon} boxSize={3} />
                        <Text>{repo.stargazers_count}</Text>
                        <Text>•</Text>
                        <Text>{t("updatedAt")} {repoUpdatedLabel(repo.updated_at)}</Text>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </Box>
              </Stack>
            </>
          )}
        </VStack>
      </Container>
      </Flex>
    </>
  );
}
