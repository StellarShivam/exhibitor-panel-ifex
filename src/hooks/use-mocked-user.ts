// TO GET THE USER FROM THE AUTHCONTEXT, YOU CAN USE

// CHANGE:
// import { useMockedUser } from 'src/hooks/use-mocked-user';
// const { user } = useMockedUser();

// TO:
// import { useAuthContext } from 'src/auth/hooks';
// const { user } = useAuthContext();

// ----------------------------------------------------------------------

export function useMockedUser() {
  const user = {
    id: '8864c717-587d-472a-929a-8e5f298024da-0',
    displayName: 'Jaydon Frankie',
    email: 'demo@minimals.cc',
    password: 'demo1234',
    coverUrl:
      'https://media-hosting.imagekit.io/e02d57d15bdd4d18/banner.jpeg?Expires=1838370446&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=ltcb8tKQXfkH6nEKNEUNs-E4JM594MrZIo2N9D8pSdueg6SQYF4CBb2PVZ9SuWBleLvheqcLHjNPFT-OrkxQriy79V2vavAd2BPA2l9oEkx~-h1~r7RObjs~dVyl48KAlNYDQZzabw7ZE-t~1yVgsS7ptZotWu4TT2y9kIP7GIAvIQ8t1dhB01xNqWkwGb-USus~MeHk30RGkWX5Nf0-91ViTFxA3YCMZX8XBkBuWw77X9GIr64AKAtUZQ0kCxjWE0XMn9kgqKRDkuMc9Knj5N4T6jlLAxJBWaTlafYeS7OaGavkwFOtbTBU6BccZHMEXE89P5SySHy5dtev3PXODA__',
    photoURL:
      'https://media-hosting.imagekit.io/a58daaa218854df1/avatar-3.png?Expires=1838193838&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=SQhWKD1ZNlRGXs5lSuVHBEuwSDd86fSLSr0ZOIWame1d91I6yxGdRsuNTquS5qqR7IEy5oSnXccVcuXnoP3u2Tgd1zvukZNBjnTIVq-the9rYSz3dB2-4Mxc1S4GG-JI-yX00m7apd5whtg07FKPH9-izmqTyFfjwZYohc3ZgXsdtw4dpYAzSsyYvlnrW1VpSJ6bHSBUlu11ZhyIi65Hy9jGh9ET5k5qTeJc46kwzt9San4LWI4KPeRrXDobT~e84~6vkQKaWOOwMl8gUwcZhkr-vtCPacH8E6-cVUoDRwfqbW7nd5tPkY4GXVfH0~5YiRi9aVOZz9Xy37B74hicBQ__',
    phoneNumber: '+40 777666555',
    country: 'United States',
    address: '90210 Broadway Blvd',
    state: 'California',
    city: 'San Francisco',
    zipCode: '94116',
    about: 'Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus.',
    role: 'admin',
    isPublic: true,
  };

  return { user };
}
