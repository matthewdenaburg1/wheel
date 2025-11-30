// class Names extends Array<string> {
//   constructor(...names: string[]) {
//     super(...names);
//   }

//   // randomize in place
//   randomize(): this {
//     this.sort(() => Math.random() - 0.5);
//     return this;
//   }

//   toUrl(): URL {
//     const params = new URLSearchParams(
//       this.map(encodeURIComponent).map(name => ['name', name])
//     );
//     window.location.p

//     return new URL(`?${params}`, window.location.origin);
//   }

//   static fromUrl(): Names {
//     return new Names(
//       ...new URLSearchParams(window.location.search)
//         .getAll("name")
//         .map(decodeURIComponent)
//     );
//   }
// }

// export default Names;
