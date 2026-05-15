import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import Cookies from 'js-cookie'
import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import {BiLinkExternal} from 'react-icons/bi'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarJobs from '../SimilarJobs'
import './index.css'

const AboutJobItem = () => {
  const {id} = useParams()

  const [jobDataDetails, setJobDataDetails] = useState([])
  const [similarJobsData, setSimilarJobsData] = useState([])
  const [apiStatus, setApiStatus] = useState('INITIAL')

  const getJobData = async () => {
    setApiStatus('IN_PROGRESS')
    const jwtToken = Cookies.get('jwt_token')
    const jobDetailsApiUrl = `http://localhost:5000/jobs/${id}`
    const optionsJobData = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const responseJobData = await fetch(jobDetailsApiUrl, optionsJobData)

    if (responseJobData.ok === true) {
      const fetchedJobData = await responseJobData.json()

      const updatedJobDetailsData = []
      const mainJob = fetchedJobData.job_details
      updatedJobDetailsData.push({
        companyLogoUrl: mainJob.company_logo_url,
        companyWebsiteUrl: mainJob.company_website_url,
        employmentType: mainJob.employment_type,
        id: mainJob.id,
        jobDescription: mainJob.job_description,
        lifeAtCompany: {
          description: mainJob.life_at_company.description,
          imageUrl: mainJob.life_at_company.image_url,
        },
        location: mainJob.location,
        packagePerAnnum: mainJob.package_per_annum,
        rating: mainJob.rating,
        skills: mainJob.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        title: mainJob.title,
      })

      const updatedSimilarJobDetails = []
      for (let i = 0; i < fetchedJobData.similar_jobs.length; i += 1) {
        const simJob = fetchedJobData.similar_jobs[i]
        updatedSimilarJobDetails.push({
          companyLogoUrl: simJob.company_logo_url,
          id: simJob.id,
          jobDescription: simJob.job_description,
          location: simJob.location,
          rating: simJob.rating,
          title: simJob.title,
        })
      }

      setJobDataDetails(updatedJobDetailsData)
      setSimilarJobsData(updatedSimilarJobDetails)
      setApiStatus('SUCCESS')
    } else {
      setApiStatus('FAILURE')
    }
  }

  useEffect(() => {
    getJobData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const renderJobDetailsSuccessView = () => {
    if (jobDataDetails.length >= 1) {
      const currentJob = jobDataDetails[0]

      return (
        <>
          <div className="job-item-container">
            <div className="first-part-container">
              <div className="img-title-container">
                <img
                  className="company-logo"
                  src={currentJob.companyLogoUrl}
                  alt="job details company logo"
                />
                <div className="title-rating-container">
                  <h1 className="title-heading">{currentJob.title}</h1>
                  <div className="star-rating-container">
                    <AiFillStar className="star-icon" />
                    <p className="rating-text">{currentJob.rating}</p>
                  </div>
                </div>
              </div>
              <div className="location-package-container">
                <div className="location-job-type-container">
                  <div className="location-icon-location-container">
                    <MdLocationOn className="location-icon" />
                    <p className="location">{currentJob.location}</p>
                  </div>
                  <div className="employment-type-icon-employment-type-container">
                    <p className="job-type">{currentJob.employmentType}</p>
                  </div>
                </div>
                <div className="package-container">
                  <p className="package">{currentJob.packagePerAnnum}</p>
                </div>
              </div>
            </div>
            <hr className="item-hr-line" />
            <div className="second-part-container">
              <div className="description-visit-container">
                <h1 className="description-job-heading">Description</h1>
                <a className="visit-anchor" href={currentJob.companyWebsiteUrl}>
                  Visit <BiLinkExternal />
                </a>
              </div>
              <p className="description-para">{currentJob.jobDescription}</p>
            </div>
            <h1>Skills</h1>
            <ul className="ul-job-details-container">
              {currentJob.skills.map(eachItem => (
                <li className="li-job-details-container" key={eachItem.name}>
                  <img
                    className="skill-img"
                    src={eachItem.imageUrl}
                    alt={eachItem.name}
                  />
                  <p>{eachItem.name}</p>
                </li>
              ))}
            </ul>
            <div className="company-life-img-container">
              <div className="life-heading-para-container">
                <h1>Life at Company</h1>
                <p>{currentJob.lifeAtCompany.description}</p>
              </div>
              <img
                src={currentJob.lifeAtCompany.imageUrl}
                alt="life at company"
              />
            </div>
          </div>
          <h1 className="similar-jobs-heading">Similar Jobs</h1>
          <ul className="similar-jobs-ul-container">
            {similarJobsData.map(eachItem => (
              <SimilarJobs
                key={eachItem.id}
                similarJobData={eachItem}
                employmentType={currentJob.employmentType}
              />
            ))}
          </ul>
        </>
      )
    }
    return null
  }

  const renderJobFailureView = () => (
    <div className="job-details-failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>we cannot seem to find the page you are looking for.</p>
      <div className="btn-container-failure">
        <button
          className="failure-jod-details-btn"
          type="button"
          onClick={getJobData}
        >
          retry
        </button>
      </div>
    </div>
  )

  const renderJobLoadingView = () => (
    <div className="job-details-loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  const renderJobDetails = () => {
    if (apiStatus === 'SUCCESS') {
      return renderJobDetailsSuccessView()
    }
    if (apiStatus === 'FAILURE') {
      return renderJobFailureView()
    }
    if (apiStatus === 'IN_PROGRESS') {
      return renderJobLoadingView()
    }
    return null
  }

  return (
    <>
      <Header />
      <div className="job-details-view-container">{renderJobDetails()}</div>
    </>
  )
}

export default AboutJobItem
