import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {AiOutlineSearch} from 'react-icons/ai'
import Header from '../Header'
import JobItem from '../JobItem'
import './index.css'

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

const AllJobs = () => {
  const [profileData, setProfileData] = useState([])
  const [jobsData, setJobsData] = useState([])
  const [checkboxInputs, setCheckboxInputs] = useState([])
  const [radioInput, setRadioInput] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const [apiStatus, setApiStatus] = useState('INITIAL')
  const [apiJobsStatus, setApiJobsStatus] = useState('INITIAL')
  const [responseSuccess, setResponseSuccess] = useState(false)

  const getProfileDetails = async () => {
    setApiStatus('IN_PROGRESS')
    const jwtToken = Cookies.get('jwt_token')
    const profileApiUrl = 'http://localhost:5000/profile'
    const optionsProfile = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(profileApiUrl, optionsProfile)
    if (response.ok === true) {
      const data = await response.json()
      const updated = [
        {
          name: data.profile_details.name,
          profileImageUrl: data.profile_details.profile_image_url,
          shortBio: data.profile_details.short_bio,
        },
      ]
      setProfileData(updated)
      setResponseSuccess(true)
      setApiStatus('SUCCESS')
    } else {
      setApiStatus('FAILURE')
    }
  }

  const getJobDetails = async () => {
    setApiJobsStatus('IN_PROGRESS')
    const jwtToken = Cookies.get('jwt_token')
    const jobsApiUrl = `http://localhost:5000/jobs?employment_type=${checkboxInputs}&minimum_package=${radioInput}&search=${searchInput}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(jobsApiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedJobs = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      setJobsData(updatedJobs)
      setApiJobsStatus('SUCCESS')
    } else {
      setApiJobsStatus('FAILURE')
    }
  }

  useEffect(() => {
    getProfileDetails()
    getJobDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkboxInputs, radioInput])

  const onGetRadioOption = event => {
    setRadioInput(event.target.id)
  }

  const onGetInputOption = event => {
    if (checkboxInputs.includes(event.target.id)) {
      const filteredList = checkboxInputs.filter(
        each => each !== event.target.id,
      )
      setCheckboxInputs(filteredList)
    } else {
      setCheckboxInputs([...checkboxInputs, event.target.id])
    }
  }

  const onRetryProfile = () => {
    getProfileDetails()
  }

  const onRetryJobs = () => {
    getJobDetails()
  }

  const onGetSearchInput = event => {
    setSearchInput(event.target.value)
  }

  const onSubmitSearchInput = () => {
    getJobDetails()
  }

  const onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      getJobDetails()
    }
  }

  const renderLoadingView = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  const onGetProfileView = () => {
    if (responseSuccess === true && profileData.length > 0) {
      const myProfile = profileData[0]
      return (
        <div className="profile-container">
          <img
            src={myProfile.profileImageUrl}
            className="profile-icon"
            alt="profile"
          />
          <h1 className="profile-name">{myProfile.name}</h1>
          <p className="profile-description">{myProfile.shortBio}</p>
        </div>
      )
    }
    return null
  }

  const onGetProfileFailureView = () => (
    <div className="failure-button-container">
      <button className="failure-button" type="button" onClick={onRetryProfile}>
        retry
      </button>
    </div>
  )

  const onRenderProfileStatus = () => {
    if (apiStatus === 'SUCCESS') {
      return onGetProfileView()
    }
    if (apiStatus === 'FAILURE') {
      return onGetProfileFailureView()
    }
    if (apiStatus === 'IN_PROGRESS') {
      return renderLoadingView()
    }
    return null
  }

  const onGetJobsFailureView = () => (
    <div className="failure-img-button-container">
      <img
        className="failure-img"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-paragraph">
        we cannot seem to find the page you are looking for
      </p>
      <div className="jobs-failure-button-container">
        <button className="failure-button" type="button" onClick={onRetryJobs}>
          retry
        </button>
      </div>
    </div>
  )

  const onGetJobsView = () => {
    if (jobsData.length === 0) {
      return (
        <div className="no-jobs-container">
          <img
            className="no-jobs-img"
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />
          <h1>No jobs found</h1>
          <p>We could not find any jobs. Try other filters.</p>
        </div>
      )
    }
    return (
      <ul className="ul-job-items-container">
        {jobsData.map(eachItem => (
          <JobItem key={eachItem.id} jobData={eachItem} />
        ))}
      </ul>
    )
  }

  const onRenderJobsStatus = () => {
    if (apiJobsStatus === 'SUCCESS') {
      return onGetJobsView()
    }
    if (apiJobsStatus === 'FAILURE') {
      return onGetJobsFailureView()
    }
    if (apiJobsStatus === 'IN_PROGRESS') {
      return renderLoadingView()
    }
    return null
  }

  const onGetCheckBoxesView = () => (
    <ul className="check-boxes-container">
      {employmentTypesList.map(eachItem => (
        <li className="li-container" key={eachItem.employmentTypeId}>
          <input
            className="input"
            id={eachItem.employmentTypeId}
            type="checkbox"
            onChange={onGetInputOption}
          />
          <label className="label" htmlFor={eachItem.employmentTypeId}>
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  const onGetRadioButtonsView = () => (
    <ul className="radio-button-container">
      {salaryRangesList.map(eachItem => (
        <li className="li-container" key={eachItem.salaryRangeId}>
          <input
            className="radio"
            id={eachItem.salaryRangeId}
            type="radio"
            name="option"
            onChange={onGetRadioOption}
          />
          <label className="label" htmlFor={eachItem.salaryRangeId}>
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  return (
    <>
      <Header />
      <div className="all-jobs-container">
        <div className="side-bar-container">
          {onRenderProfileStatus()}
          <hr className="hr-line" />
          <h1 className="text">Type of Employment</h1>
          {onGetCheckBoxesView()}
          <hr className="hr-line" />
          <h1 className="text">Salary Range</h1>
          {onGetRadioButtonsView()}
        </div>
        <div className="jobs-container">
          <div>
            <input
              className="search-input"
              type="search"
              value={searchInput}
              placeholder="Search"
              onChange={onGetSearchInput}
              onKeyDown={onEnterSearchInput}
            />
            <button
              type="button"
              className="search-button"
              onClick={onSubmitSearchInput}
            >
              <AiOutlineSearch className="search-icon" />
            </button>
          </div>
          {onRenderJobsStatus()}
        </div>
      </div>
    </>
  )
}

export default AllJobs
