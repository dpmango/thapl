/* eslint-disable no-use-before-define */
export interface IGeoCoords {
  latitude: number
  longitude: number
}

export interface IGeoDataRef {
  requested: boolean
  found: boolean | null
  latitude: number | null
  longitude: number | null
  text: string
}

export interface YandexGeocoderResponce {
  response: Response
}

export interface Response {
  GeoObjectCollection: GeoObjectCollection
}

export interface GeoObjectCollection {
  metaDataProperty: GeoObjectCollectionMetaDataProperty
  featureMember: FeatureMember[]
}

export interface FeatureMember {
  GeoObject: GeoObject
}

export interface GeoObject {
  metaDataProperty: GeoObjectMetaDataProperty
  name: string
  description?: string
  boundedBy: BoundedBy
  Point: Point
}

export interface Point {
  pos: string
}

export interface BoundedBy {
  Envelope: Envelope
}

export interface Envelope {
  lowerCorner: string
  upperCorner: string
}

export interface GeoObjectMetaDataProperty {
  GeocoderMetaData: GeocoderMetaData
}

export interface GeocoderMetaData {
  precision: string
  text: string
  kind: string
  Address: Address
  AddressDetails: AddressDetails
}

export interface Address {
  country_code: string
  formatted: string
  Components: Component[]
}

export interface Component {
  kind: string
  name: string
}

export interface AddressDetails {
  Country: Country
}

export interface Country {
  AddressLine: string
  CountryNameCode: string
  CountryName: string
  AdministrativeArea?: AdministrativeArea
}

export interface AdministrativeArea {
  AdministrativeAreaName: string
  SubAdministrativeArea?: SubAdministrativeArea
}

export interface SubAdministrativeArea {
  SubAdministrativeAreaName: string
  Locality?: Locality
}

export interface Locality {
  LocalityName: string
  Thoroughfare?: Thoroughfare
}

export interface Thoroughfare {
  ThoroughfareName: string
  Premise?: Premise
}

export interface Premise {
  PremiseNumber: string
}

export interface GeoObjectCollectionMetaDataProperty {
  GeocoderResponseMetaData: GeocoderResponseMetaData
}

export interface GeocoderResponseMetaData {
  Point: Point
  request: string
  results: string
  found: string
}
