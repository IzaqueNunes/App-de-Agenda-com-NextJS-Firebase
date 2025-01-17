import React, { useState } from 'react'
import { useRouter } from 'next/router'

import {
  database,
  ref,
  set,
  storage,
  refStorage,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable
} from '../services/firebase'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { v4 as uuidv4 } from 'uuid'
import {
  Button,
  Flex,
  Grid,
  Heading,
  Input,
  Textarea,
  useToast
} from '@chakra-ui/react'
import Link from 'next/link'
import MenuDrawer from '../components/ui/drawer/MenuDrawer'
import Header from '../components/ui/header/Header'

const NewEvent: React.FC = () => {
  const toast = useToast()

  const router = useRouter()

  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [category, setCategory] = useState('')
  const [local, setLocal] = useState('')
  const [ticket, setTicket] = useState('')
  const [image, setImage] = useState(null)
  const [description, setDescription] = useState('')

  const [loading, setLoading] = useState(false)

  const writeUserData = () => {
    let eventId = uuidv4()
    setLoading(true)

    const storageRefPath = refStorage(storage, `/files/${image.name}`)

    uploadBytes(storageRefPath, image).then(snapshot => {
      getDownloadURL(storageRefPath).then(downloadURL => {
        set(ref(database, 'events/' + eventId), {
          title: title,
          date: new Date(date).toLocaleDateString(),
          category: category,
          local: local,
          ticket: ticket,
          description: description,
          imageUrl: downloadURL
        })
        console.log('URL: ', downloadURL)
      })
      console.log('Uploaded a blob or file!')
    })
    toast({
      position: 'top',
      description: 'Evento cadastrado com sucesso',
      status: 'success',
      duration: 3000
    })
    setTimeout(() => {
      setLoading(false)
      router.push('/home')
    }, 3000)
  }

  return (
    <Flex height="100vh" direction="column">
      <Flex gridArea="menu">
        <Header title="Novo evento" />
      </Flex>
      <Grid
        as="main"
        height="90vh"
        backgroundColor="#fff"
        templateColumns="550px"
        templateRows="30px 1fr"
        templateAreas="
         'menu'
         'main'
     "
        justifyContent="center"
      >
        <Flex
          gridArea="main"
          marginBottom="15px"
          backgroundColor="gray.700"
          borderColor="gray.800"
          borderRadius="md"
          padding={16}
          flexDir="column"
          alignItems="stretch"
          gap={6}
        >
          <Input
            height="50px"
            backgroundColor="gray.800"
            focusBorderColor="purple.500"
            border="none"
            color="#fff"
            type="text"
            placeholder="Título"
            onChange={e => setTitle(e.currentTarget.value)}
          />
          <Input
            height="50px"
            backgroundColor="gray.800"
            focusBorderColor="purple.500"
            border="none"
            color="#fff"
            type="date"
            placeholder="Data"
            onChange={e => setDate(e.currentTarget.value)}
          />
          <Input
            height="50px"
            backgroundColor="gray.800"
            focusBorderColor="purple.500"
            border="none"
            color="#fff"
            type="text"
            placeholder="Categoria"
            onChange={e => setCategory(e.currentTarget.value)}
          />
          <Input
            height="50px"
            backgroundColor="gray.800"
            focusBorderColor="purple.500"
            border="none"
            color="#fff"
            type="text"
            placeholder="Modalidade/Local"
            onChange={e => setLocal(e.currentTarget.value)}
          />
          <Input
            height="50px"
            backgroundColor="gray.800"
            focusBorderColor="purple.500"
            border="none"
            color="#fff"
            type="text"
            placeholder="Ingresso"
            onChange={e => setTicket(e.currentTarget.value)}
          />
          <Heading size="sm" color="#fff">
            {' '}
            Escolha uma imagem:{' '}
          </Heading>
          <Input
            height="50px"
            backgroundColor="gray.800"
            focusBorderColor="purple.500"
            border="none"
            color="#fff"
            placeholder="Imagem"
            type="file"
            onChange={e => setImage(e.currentTarget.files[0])}
          />

          <Textarea
            placeholder="Descrição"
            size="sm"
            backgroundColor="gray.800"
            focusBorderColor="purple.500"
            border="none"
            color="#fff"
            onChange={e => setDescription(e.currentTarget.value)}
          />
          <Button
            marginTop={6}
            backgroundColor="purple.500"
            _hover={{ backgroundColor: 'purple.600' }}
            height="50px"
            borderRadius="sm"
            color="#fff"
            isLoading={loading}
            onClick={writeUserData}
          >
            Enviar
          </Button>
        </Flex>
      </Grid>
    </Flex>
  )
}

export default NewEvent
