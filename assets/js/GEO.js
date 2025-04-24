/**
 * Fully Qualified GEOID Structure
 * [3 CHAR Summary Level][2 CHAR Geo Variant or 00][2 CHAR Geo Component or 00]["US"][variable length GEOID/FIPS Code]
 *
 * GeoLevel - GeoID Length - json_response GeoType - Summary Level - Geo Variant - Geo Component - GEOID/FIPS Code Construction
 *  0       -  2           -  State                -  040          -  00         -  00           -  State(2)
 *  1       -  4           -  AIAN                 -  250          -  00         -  00           -  AIAN(4)
 *  1       -  6           -  State AIAN           -  280          -  00         -  00           -  State(2)+AIANNHCE(4)
 *  2       -  4           -  Congressional Dist.  -  500          -  XX*        -  00           -  State(2)+CD(2)
 *  3       -  5           -  County               -  050          -  00         -  00           -  State(2)+County(3)
 *  4       -  10          -  MCD                  -  060          -  00         -  00           -  State(2)+County(3)+MCD(5)
 *  5       -  7           -  Place                -  160          -  00         -  00           -  State(2)+Place(5)
 *  6       -  11          -  Tract                -  140          -  00         -  00           -  State(2)+County(3)+Tract(6)
 *  7       -  12          -  Blockgroup           -  150          -  00         -  00           -  State(2)+County(3)+Tract(6)+Blockgroup(1)
 *  8       -  15          -  Block                -  101          -  00         -  00           -  State(2)+County(3)+Tract(6)+Block(4)
 *  9       -  5           -  State Upper Chamber  -               -  00         -  00           -  State(2)+SLDU(3)
 * 10       -  5           -  State Lower Chamber  -               -  00         -  00           -  State(2)+SLDL(3)
 * 11       -  5           -  ZCTA                 -               -  00         -  00           -  ZCTA(5)
 *
 * XX* = 2 digits of the Congress, '18' for 118th, '19' for 119th congress, etc.
 */