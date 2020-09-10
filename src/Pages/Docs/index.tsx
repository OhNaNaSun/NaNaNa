import React, { useState, useEffect } from 'react'
import { Layout, message } from 'antd'
import { useLocation, useHistory } from 'react-router-dom'
import MdContent from './Content/MdContent'
import AppSidebar from './Sidebar'
import BreadCrumb from './BreadCrumb'

const Container: React.FC = () => {
  const { pathname } = useLocation()
  const [, currentDirName, currentCateName, currentPathFileName] = pathname.split('/')
  const currentFileName = currentPathFileName === 'add' ? '' : currentPathFileName
  const [mdContent, setMdContent] = useState('')
  const [isReadOnly, setIsReadOnly] = useState(false)
  const [lastUpdateTime, setLastUpdateTime] = useState('')
  const history = useHistory()

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/api/auth`)
      .then((res) => res.json())
      .then((data) => {
        setIsReadOnly(!data)
      })
  }, [])

  const postMdContent = (newFileName: string): void => {
    fetch(`${process.env.PUBLIC_URL}/api/files/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        name: `${currentDirName}/${currentCateName}/${newFileName}`,
        mdContent,
      }),
    })
      .then((res) => {
        message.success(res.statusText)
        history.push(`/${currentDirName}/${currentCateName}/${newFileName}`)
      })
      .catch((error) => {
        message.error(error.message)
      })
  }
  return (
    <Layout>
      <AppSidebar currentDirName={currentDirName} currentCateName={currentCateName} currentFileName={currentFileName} />
      <Layout style={{ padding: '0 24px 24px' }}>
        <BreadCrumb
          currentDirName={currentDirName}
          currentCateName={currentCateName}
          currentFileName={currentFileName}
          isReadOnly={isReadOnly}
          saveItem={(newFileName: string): void => {
            postMdContent(newFileName)
          }}
          lastUpdateTime={lastUpdateTime}
        />
        <MdContent
          isReadOnly={isReadOnly}
          currentDirName={currentDirName}
          currentCateName={currentCateName}
          currentFileName={currentFileName}
          returnNewMdContent={(value: string): void => {
            setMdContent(value)
          }}
          returnLastUpdateTime={(value: string): void => {
            setLastUpdateTime(value)
          }}
        />
      </Layout>
    </Layout>
  )
}
export default Container
