# [1.19.0](https://github.com/skyscope-app/skyscope-backend/compare/v1.18.0...v1.19.0) (2024-04-08)


### Bug Fixes

* remove airports.json ([5cfbf8d](https://github.com/skyscope-app/skyscope-backend/commit/5cfbf8d5ca70dd887a59fa64908bce7bf58434e7))


### Features

* **airports:** fetching airport data from navigraph ([1f6d838](https://github.com/skyscope-app/skyscope-backend/commit/1f6d8383cedd4d15c86fdb67e91b191d0e63b03b))
* **navigraph:** add airport to fetch airports from navigraph ([bee4a2e](https://github.com/skyscope-app/skyscope-backend/commit/bee4a2e302003b4d08386f36d55531b358062e83))

# [1.18.0](https://github.com/skyscope-app/skyscope-backend/compare/v1.17.1...v1.18.0) (2024-04-07)


### Features

* **vatsim:** improve vatsim responses to add geometry to atc and onGround property to flights ([2986729](https://github.com/skyscope-app/skyscope-backend/commit/298672923dd64032d1584282cb92cf0107a1c806))

## [1.17.1](https://github.com/skyscope-app/skyscope-backend/compare/v1.17.0...v1.17.1) (2024-04-06)


### Bug Fixes

* **config:** remove not necessary configuration ([8c405c6](https://github.com/skyscope-app/skyscope-backend/commit/8c405c69cadeb2993a69b28ec097e551ca63a743))

# [1.17.0](https://github.com/skyscope-app/skyscope-backend/compare/v1.16.0...v1.17.0) (2024-04-06)


### Bug Fixes

* **profile:** allow users in wait list to use profile endpoints ([a53fb81](https://github.com/skyscope-app/skyscope-backend/commit/a53fb8127a7cae4e2069d16162353daae7466131))


### Features

* **atc:** add endpoint to fetch atc ([8cafd86](https://github.com/skyscope-app/skyscope-backend/commit/8cafd8684887cc21798dcbe4efac2292480fd21f))
* **vatsim:** first implementation to get geometry from vatsim centers ([e1123be](https://github.com/skyscope-app/skyscope-backend/commit/e1123beb9263f103ee43f2687f0d3dfd54f1875e))

# [1.16.0](https://github.com/skyscope-app/skyscope-backend/compare/v1.15.0...v1.16.0) (2024-04-06)


### Features

* **airac:** add endpoint to fetch current airac cycle for authenticated user ([414448e](https://github.com/skyscope-app/skyscope-backend/commit/414448e9832dd357abe8f641c6bbe955e0498095))

# [1.15.0](https://github.com/skyscope-app/skyscope-backend/compare/v1.14.0...v1.15.0) (2024-03-26)


### Bug Fixes

* **account:** add account status to user ([1bbddcd](https://github.com/skyscope-app/skyscope-backend/commit/1bbddcde95884a61cb18e137cd79aa41382f0fb7))
* add name for update profile ([a3544db](https://github.com/skyscope-app/skyscope-backend/commit/a3544dbc30cada652341795832bcac749dee23dc))


### Features

* add endpoint to upload user photo ([d710544](https://github.com/skyscope-app/skyscope-backend/commit/d710544b81005729aecda6b7109ba1eac5a89195))

# [1.14.0](https://github.com/skyscope-app/skyscope-backend/compare/v1.13.3...v1.14.0) (2024-03-17)


### Bug Fixes

* generate new tag ([1828b8b](https://github.com/skyscope-app/skyscope-backend/commit/1828b8b03eef3851b4191c2d0a3e6f23e8498d7c))
* list files of navigraph-data ([30d92c6](https://github.com/skyscope-app/skyscope-backend/commit/30d92c6663cfc64f469560d55b203644e9649f00))


### Features

* add controller to list files ([3d2a172](https://github.com/skyscope-app/skyscope-backend/commit/3d2a1728a9e853fb60b05f43f5696a65ba69a31f))

# [1.14.0](https://github.com/skyscope-app/skyscope-backend/compare/v1.13.3...v1.14.0) (2024-03-17)


### Bug Fixes

* list files of navigraph-data ([30d92c6](https://github.com/skyscope-app/skyscope-backend/commit/30d92c6663cfc64f469560d55b203644e9649f00))


### Features

* add controller to list files ([3d2a172](https://github.com/skyscope-app/skyscope-backend/commit/3d2a1728a9e853fb60b05f43f5696a65ba69a31f))

## [1.13.3](https://github.com/skyscope-app/skyscope-backend/compare/v1.13.2...v1.13.3) (2024-03-16)


### Bug Fixes

* **ivao:** fix ivao equipment info ([8ca13f5](https://github.com/skyscope-app/skyscope-backend/commit/8ca13f57c6873c72d0a0cc1020eabf32d205e53d))

## [1.13.2](https://github.com/skyscope-app/skyscope-backend/compare/v1.13.1...v1.13.2) (2024-03-15)


### Bug Fixes

* Rename app to correct domain ([5d7ddcb](https://github.com/skyscope-app/skyscope-backend/commit/5d7ddcb17db268d89fb0430a147ae3c4c51ae3f2))

## [1.13.1](https://github.com/skyscope-app/skyscope-backend/compare/v1.13.0...v1.13.1) (2024-03-11)


### Bug Fixes

* **logs:** add error on log if discord webhook fails ([f90307a](https://github.com/skyscope-app/skyscope-backend/commit/f90307abc4bf3ff1623ace6c63d1a86467812963))

# [1.13.0](https://github.com/skyscope-app/skyscope-backend/compare/v1.12.7...v1.13.0) (2024-03-11)


### Bug Fixes

* **flights:** improve search ([5d18979](https://github.com/skyscope-app/skyscope-backend/commit/5d189790a0105cc4083064509d0d41ff312c2093))
* **performance:** improve performance of endpoints ([33c92fe](https://github.com/skyscope-app/skyscope-backend/commit/33c92feffddb12da40c3a93c6663d6ef9dc78fda))


### Features

* **flights:** add endpoint to return tracks ([7a0e36a](https://github.com/skyscope-app/skyscope-backend/commit/7a0e36a1549a8c1f8feca325959f5ad84336c99e))

## [1.12.7](https://github.com/skyscope-app/skyscope-backend/compare/v1.12.6...v1.12.7) (2024-03-06)


### Bug Fixes

* **networks:** improve network fetch performance ([7254d13](https://github.com/skyscope-app/skyscope-backend/commit/7254d131851a709dd4d0da4e3558a1efeef14741))

## [1.12.6](https://github.com/skyscope-app/skyscope-backend/compare/v1.12.5...v1.12.6) (2024-03-06)


### Bug Fixes

* **cors:** correct domain ([2111a05](https://github.com/skyscope-app/skyscope-backend/commit/2111a0547db49ea4cd129a67f28e20922f9fe919))

## [1.12.5](https://github.com/skyscope-app/skyscope-backend/compare/v1.12.4...v1.12.5) (2024-03-06)


### Bug Fixes

* **ivao:** fix lat and lng ([4074576](https://github.com/skyscope-app/skyscope-backend/commit/407457691af39ba69b67d893593ebe32763a9488))

## [1.12.4](https://github.com/skyscope-app/skyscope-backend/compare/v1.12.3...v1.12.4) (2024-03-06)


### Bug Fixes

* **cors:** add cors protection ([517d127](https://github.com/skyscope-app/skyscope-backend/commit/517d1274e79a04c5030e0203d6774d82fe55db37))

## [1.12.3](https://github.com/skyscope-app/skyscope-backend/compare/v1.12.2...v1.12.3) (2024-03-04)


### Bug Fixes

* **logger:** run custom logger in prod ([5e1dec1](https://github.com/skyscope-app/skyscope-backend/commit/5e1dec1e95911f99a38c255a67021a60bc4eb0a6))

## [1.12.2](https://github.com/skyscope-app/skyscope-backend/compare/v1.12.1...v1.12.2) (2024-03-04)


### Bug Fixes

* **logger:** rollback logger ([1a71ab8](https://github.com/skyscope-app/skyscope-backend/commit/1a71ab8fe93b5e9ad95cd8c9728f9ef4b349adbd))

## [1.12.1](https://github.com/skyscope-app/skyscope-backend/compare/v1.12.0...v1.12.1) (2024-03-04)


### Bug Fixes

* **cache:** avoid colission of keys on cache ([#34](https://github.com/skyscope-app/skyscope-backend/issues/34)) ([f2c1d50](https://github.com/skyscope-app/skyscope-backend/commit/f2c1d50c58728566a384865f900e220dd61b6108))
* improve flight load ([dbe614d](https://github.com/skyscope-app/skyscope-backend/commit/dbe614dc7ef1ea58ff10f321fa52f5344ea40549))
* **logs:** add service name on discord notification ([01114f7](https://github.com/skyscope-app/skyscope-backend/commit/01114f73817b91bdfd5d0baaeb25b74d3e50b3bc))
* **network:** add endpoints to search flights from network ([a6125ba](https://github.com/skyscope-app/skyscope-backend/commit/a6125ba1c62cf225c49912d8f010c7fe382f1d3f))

# [1.12.0](https://github.com/skyscope-app/skyscope-backend/compare/v1.11.1...v1.12.0) (2024-02-28)


### Features

* **discord:** add logger on discord ([#26](https://github.com/skyscope-app/skyscope-backend/issues/26)) ([e2ab995](https://github.com/skyscope-app/skyscope-backend/commit/e2ab995588b542def5c37c99cb632f8ddb65353e))

## [1.11.1](https://github.com/skyscope-app/skyscope-backend/compare/v1.11.0...v1.11.1) (2024-02-28)


### Bug Fixes

* **logger:** add winston as logger ([0d67dfc](https://github.com/skyscope-app/skyscope-backend/commit/0d67dfc6caae0c9c61e91b17300bd94e4db525fd))

# [1.11.0](https://github.com/skyscope-app/skyscope-backend/compare/v1.10.3...v1.11.0) (2024-02-28)


### Features

* integrations adjustments ([536c3b3](https://github.com/skyscope-app/skyscope-backend/commit/536c3b3c1d3f2d8319e2609bee6dfbae3e567865))

## [1.10.3](https://github.com/skyscope-app/skyscope-backend/compare/v1.10.2...v1.10.3) (2024-02-26)


### Bug Fixes

* add way to filter api on firebase function ([c9b1fa2](https://github.com/skyscope-app/skyscope-backend/commit/c9b1fa2b3e63c381a58590a7bc4ce9c089fc12a1))

## [1.10.2](https://github.com/skyscope-app/skyscope-backend/compare/v1.10.1...v1.10.2) (2024-02-26)


### Bug Fixes

* **logger:** add logger ([48b8ba9](https://github.com/skyscope-app/skyscope-backend/commit/48b8ba9f7297fbacd2562f158f9efe8f973c6951))

## [1.10.1](https://github.com/skyscope-app/skyscope-backend/compare/v1.10.0...v1.10.1) (2024-02-26)


### Bug Fixes

* write key to tmp file ([4d7851b](https://github.com/skyscope-app/skyscope-backend/commit/4d7851b7b48ad242af19ac3f3e41633919b8223c))

# [1.10.0](https://github.com/skyscope-app/skyscope-backend/compare/v1.9.0...v1.10.0) (2024-02-25)


### Bug Fixes

* add networks fetcher function ([95f6396](https://github.com/skyscope-app/skyscope-backend/commit/95f639655568a36097e9b536e040c2646aba6bde))


### Features

* add endpoint to fetch authenticated pilot route from simbrief ([294e2f9](https://github.com/skyscope-app/skyscope-backend/commit/294e2f9993178a38ce038d8529aa13d2e47ad374))
* set networks fetcher as firebase function ([4a124f8](https://github.com/skyscope-app/skyscope-backend/commit/4a124f892fb43b3159096fc320f589381fc304e3))

# [1.9.0](https://github.com/skyscope-app/skyscope-backend/compare/v1.8.1...v1.9.0) (2024-02-25)


### Features

* add endpoint to fetch authenticated pilot route from simbrief ([#22](https://github.com/skyscope-app/skyscope-backend/issues/22)) ([32dc2c4](https://github.com/skyscope-app/skyscope-backend/commit/32dc2c4d0d28f4399b1520a0af5fa08d1232ab02))

## [1.8.1](https://github.com/skyscope-app/skyscope-backend/compare/v1.8.0...v1.8.1) (2024-02-25)


### Bug Fixes

* **profile:** add nullable properties to profile dto ([4537040](https://github.com/skyscope-app/skyscope-backend/commit/4537040d388bcd40e08e298fac9ce477dec2c15a))

# [1.8.0](https://github.com/skyscope-app/skyscope-backend/compare/v1.7.1...v1.8.0) (2024-02-15)


### Features

* add aircraft type property to aircraft live flight ([2402dff](https://github.com/skyscope-app/skyscope-backend/commit/2402dfff39f4059a02da8a04fa2fc99c0f36f81d))

## [1.7.1](https://github.com/skyscope-app/skyscope-backend/compare/v1.7.0...v1.7.1) (2024-02-15)


### Bug Fixes

* **networks:** fix ivao coordinates and remove excessive payload from geojson ([7e21130](https://github.com/skyscope-app/skyscope-backend/commit/7e21130bcd3a8ac9880fcfc8bc42fb70f363d3c0))

# [1.7.0](https://github.com/skyscope-app/skyscope-backend/compare/v1.6.4...v1.7.0) (2024-02-14)


### Bug Fixes

* **auth:** fix cookie keys of authentication token ([dc784a6](https://github.com/skyscope-app/skyscope-backend/commit/dc784a6b1909aee18de029b2f0035e1efb4fb2f6))
* **auth:** update token cookie key ([8a16b57](https://github.com/skyscope-app/skyscope-backend/commit/8a16b572b4cafde59cdfdfd66a80034b7d8c2c0a))


### Features

* **integrations:** add endpoint to create integrations ([1702b5e](https://github.com/skyscope-app/skyscope-backend/commit/1702b5edfc171f62f73b9e150a8a7969913a6aad))

## [1.6.4](https://github.com/skyscope-app/skyscope-backend/compare/v1.6.3...v1.6.4) (2024-02-14)


### Bug Fixes

* **auth:** update token cookie key ([#19](https://github.com/skyscope-app/skyscope-backend/issues/19)) ([b8d1e45](https://github.com/skyscope-app/skyscope-backend/commit/b8d1e452d3879a3b4d98fc18768b338f30a5d4d1))

## [1.6.3](https://github.com/skyscope-app/skyscope-backend/compare/v1.6.2...v1.6.3) (2024-02-13)


### Bug Fixes

* use uid instead of token as cache key ([d7087fa](https://github.com/skyscope-app/skyscope-backend/commit/d7087fa35c5f2f0fc29938126b6e2346082502ad))

## [1.6.2](https://github.com/skyscope-app/skyscope-backend/compare/v1.6.1...v1.6.2) (2024-02-13)


### Bug Fixes

* ssl mode disable in configuration ([22ff8a6](https://github.com/skyscope-app/skyscope-backend/commit/22ff8a67e55985007f6e107b73feb532775c5257))

## [1.6.1](https://github.com/skyscope-app/skyscope-backend/compare/v1.6.0...v1.6.1) (2024-02-13)


### Bug Fixes

* remove database ssl mode required configuration ([7d7d4a5](https://github.com/skyscope-app/skyscope-backend/commit/7d7d4a5a363f4d8e97e765f89e3f6d7e53537417))

# [1.6.0](https://github.com/skyscope-app/skyscope-backend/compare/v1.5.0...v1.6.0) (2024-02-13)


### Bug Fixes

* **airport:** airport caching ([ab95fdd](https://github.com/skyscope-app/skyscope-backend/commit/ab95fdda7a36edc0c681b253162618b30fe303a5))


### Features

* add geojson and endpoint to return flight by id ([b945311](https://github.com/skyscope-app/skyscope-backend/commit/b94531190007355c6efa47f1fc911462e82add51))
* add jwt extraction from cookie ([433bc33](https://github.com/skyscope-app/skyscope-backend/commit/433bc33eec4d8425c1220339d29809cfd38a7244))
* **cache:** add cache via postgres ([8edb1ed](https://github.com/skyscope-app/skyscope-backend/commit/8edb1ed3aada408e158f3321a244372b76d2e6b3))
* **network:** add network caching ([a16cc1b](https://github.com/skyscope-app/skyscope-backend/commit/a16cc1b79e9ee1459e28392559cad904211329ed))

# [1.5.0](https://github.com/skyscope-app/skyscope-backend/compare/v1.4.0...v1.5.0) (2024-02-04)


### Features

* **airports:** add second source of data to airports ([53844dd](https://github.com/skyscope-app/skyscope-backend/commit/53844dd28e67c90a38a694687d774602fb82d2a8))

# [1.4.0](https://github.com/skyscope-app/skyscope-backend/compare/v1.3.1...v1.4.0) (2024-02-03)


### Features

* **friends:** add endpoint to add friend ([daedd38](https://github.com/skyscope-app/skyscope-backend/commit/daedd38fdcc40aefea559201b31cd1547a419b80))
* **friends:** allow friend addition by search params ([1c9f942](https://github.com/skyscope-app/skyscope-backend/commit/1c9f9420c22819328ed191c8c9938b8056a24d65))
* **user:** add endpoint to get user profile ([8136fd6](https://github.com/skyscope-app/skyscope-backend/commit/8136fd621df089ea9dec3847f9d7495eb3ea5fea))

## [1.3.1](https://github.com/skyscope-app/skyscope-backend/compare/v1.3.0...v1.3.1) (2024-01-29)


### Bug Fixes

* **database:** ssl mode ([4d43f9a](https://github.com/skyscope-app/skyscope-backend/commit/4d43f9aae7b23e2d45d8e737dc947135326d1b89))

# [1.3.0](https://github.com/skyscope-app/skyscope-backend/compare/v1.2.0...v1.3.0) (2024-01-29)


### Features

* **users:** add users and friends table ([4bb133e](https://github.com/skyscope-app/skyscope-backend/commit/4bb133e85a338944bb464383c64afc9711bc556b))
* **users:** add users feature ([09cefd1](https://github.com/skyscope-app/skyscope-backend/commit/09cefd17b87354f63685b8abce36fd00274dc367))

# [1.2.0](https://github.com/skyscope-app/skyscope-backend/compare/v1.1.0...v1.2.0) (2024-01-29)


### Bug Fixes

* **nat:** add cache control ([476bdef](https://github.com/skyscope-app/skyscope-backend/commit/476bdefd72a615985b3f9159d99f675ef370f3e2))


### Features

* **nat:** implement nat endpoint ([ae99a62](https://github.com/skyscope-app/skyscope-backend/commit/ae99a629b3f096830e407d80bedfd45bc55845b8))

# [1.1.0](https://github.com/skyscope-app/skyscope-backend/compare/v1.0.2...v1.1.0) (2024-01-27)


### Features

* **ivao:** add endpoint to get current status of ivao network ([#2](https://github.com/skyscope-app/skyscope-backend/issues/2)) ([00c049b](https://github.com/skyscope-app/skyscope-backend/commit/00c049b08877adbaf2b639a0e907ab5fd7df70ee))

## [1.0.2](https://github.com/skyscope-app/skyscope-backend/compare/v1.0.1...v1.0.2) (2024-01-27)


### Bug Fixes

* **airports:** remove not used airport service method ([b6150f7](https://github.com/skyscope-app/skyscope-backend/commit/b6150f7649360ff2ac7847109341ddbe8000182f))

## [1.0.1](https://github.com/skyscope-app/skyscope-backend/compare/v1.0.0...v1.0.1) (2024-01-27)


### Bug Fixes

* **vatsim:** add missing data in api ([1b8c206](https://github.com/skyscope-app/skyscope-backend/commit/1b8c206609bfd9b19463d6835bc33cf86486cf24))

# 1.0.0 (2024-01-25)


### Features

* add initial app structure ([aded37e](https://github.com/skyscope-app/skyscope-backend/commit/aded37e910579740763315b992797d177f0c3ef9))
* **networks:** add endpoint to fetch live flights from vatsim ([fc28fec](https://github.com/skyscope-app/skyscope-backend/commit/fc28fecb885e377eab26482826c9a7513be97ff8))
