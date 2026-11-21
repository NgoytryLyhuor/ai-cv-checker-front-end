import type { StructuredCv } from '@/types/check'

function replaceTextNodes(root: Node, map: Array<[RegExp, string]>): void {
  const walker = root.ownerDocument?.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  if (!walker) return
  let node = walker.nextNode()
  while (node) {
    let val = node.nodeValue ?? ''
    if (val.trim()) {
      for (const [pattern, replacement] of map) {
        val = val.replace(pattern, replacement)
      }
      node.nodeValue = val
    }
    node = walker.nextNode()
  }
}

function updateExperienceNode(el: HTMLElement, exp: StructuredCv['experience'][number]): void {
  replaceTextNodes(el, [
    [/Front-End Developer\s*[—–-]\s*Chaktomuk Tech Labs/gi, exp.company ? `${exp.role} — ${exp.company}` : exp.role],
    [/Front-End Developer/gi, exp.role || ''],
    [/2022-03-01\s*[–-]\s*Present/gi, exp.period || ''],
    [/Chaktomuk Tech Labs/gi, exp.company || ''],
  ])

  const ul = el.querySelector('ul')
  if (ul) {
    const firstLi = ul.querySelector('li')
    if (firstLi) {
      const bullets = exp.bullets.length ? exp.bullets : []
      ul.innerHTML = ''
      for (const bullet of bullets) {
        const li = firstLi.cloneNode(true) as HTMLElement
        // Set deepest text leaf or textContent
        const leaf = li.querySelector('.rich-it, .rich-line, span') || li
        leaf.textContent = bullet
        ul.appendChild(li)
      }
    }
  } else {
    // Some templates render bullets as <div class="..."><span ...>•</span><span>...</span></div>
    const bulletNodes = Array.from(el.querySelectorAll<HTMLElement>('div, p')).filter(
      (n) =>
        !n.querySelector('div, p') &&
        /Built responsive booking|Introduced reusable|Delivered mobile-friendly|Improved form validation/i.test(
          n.textContent ?? '',
        ),
    )
    if (bulletNodes.length > 0 && bulletNodes[0]?.parentElement) {
      const parent = bulletNodes[0].parentElement
      const tplBullet = bulletNodes[0].cloneNode(true) as HTMLElement
      bulletNodes.forEach((b) => b.remove())
      for (const bullet of exp.bullets) {
        const clone = tplBullet.cloneNode(true) as HTMLElement
        const spans = clone.querySelectorAll('span')
        const target = spans.length > 1 ? spans[spans.length - 1]! : clone
        target.textContent = bullet
        parent.appendChild(clone)
      }
    }
  }
}

function updateEducationNode(el: HTMLElement, edu: StructuredCv['education'][number]): void {
  replaceTextNodes(el, [
    [/Computer Science\s*[·•-]\s*Bachelor/gi, edu.degree || ''],
    [/B\.Sc\.\s*in Computer Science/gi, edu.degree || ''],
    [/Sample Institute of Technology/gi, edu.school || ''],
    [/Royal University of Phnom Penh/gi, edu.school || ''],
    [/2015-10-01\s*[–-]\s*2019-07-31/gi, edu.period || ''],
    [/2015\s*[–-]\s*2019/gi, edu.period || ''],
    [/Capstone:\s*an accessible (?:university|community) information portal\./gi, ''],
  ])
}

export function hydrateJobifyTemplate(
  rawHtml: string,
  cv: StructuredCv,
  photoUrl?: string | null,
): string {
  if (typeof DOMParser === 'undefined') return rawHtml

  const parser = new DOMParser()
  const doc = parser.parseFromString(`<div id="__jobify_root">${rawHtml}</div>`, 'text/html')
  const root = doc.getElementById('__jobify_root')
  if (!root) return rawHtml

  // 1. Update portrait images if user uploaded a photo
  root.querySelectorAll('img').forEach((img, idx) => {
    if (photoUrl) {
      img.setAttribute('src', photoUrl)
    }
    if (idx === 0) {
      img.setAttribute('data-testid', 'cv-avatar-slot')
    }
    img.setAttribute('alt', cv.fullName ? `${cv.fullName} portrait` : 'Candidate portrait')
  })

  // 2. Replace Experience records
  const expNodes = Array.from(root.querySelectorAll<HTMLElement>('[data-cv-kind="experience"]'))
  if (expNodes.length > 0) {
    const primaryParent = expNodes[0]!.parentElement
    const templateExp = expNodes[0]!.cloneNode(true) as HTMLElement
    expNodes.forEach((n) => n.remove())
    if (primaryParent) {
      for (const exp of cv.experience) {
        const clone = templateExp.cloneNode(true) as HTMLElement
        updateExperienceNode(clone, exp)
        primaryParent.appendChild(clone)
      }
    }
  }

  // 3. Replace Education records
  const eduNodes = Array.from(root.querySelectorAll<HTMLElement>('[data-cv-kind="education"]'))
  if (eduNodes.length > 0) {
    const primaryParent = eduNodes[0]!.parentElement
    const templateEdu = eduNodes[0]!.cloneNode(true) as HTMLElement
    eduNodes.forEach((n) => n.remove())
    if (primaryParent) {
      for (const edu of cv.education) {
        const clone = templateEdu.cloneNode(true) as HTMLElement
        updateEducationNode(clone, edu)
        primaryParent.appendChild(clone)
      }
    }
  }

  // 4. Remove demo-only fictional records & their section headings (projects, certifications, achievements, references)
  const demoKinds = ['projects', 'certifications', 'achievements', 'references']
  for (const kind of demoKinds) {
    const kindNodes: HTMLElement[] = Array.from(root.querySelectorAll<HTMLElement>(`[data-cv-kind="${kind}"]`))
    for (const item of kindNodes) {
      let cur: HTMLElement | null = item.parentElement
      while (cur && cur !== root) {
        const txt = (cur.textContent ?? '').trim()
        const hasOther = cur.querySelector('[data-cv-kind="experience"], [data-cv-kind="education"]')
        if (hasOther) break
        if (/^(PROJECTS|CERTIFICATION|CERTIFICATIONS|ACHIEVEMENTS|REFERENCES)\b/i.test(txt)) {
          cur.remove()
          break
        }
        cur = cur.parentElement
      }
      if (item.isConnected) {
        item.remove()
      }
    }
  }

  // Remove any remaining empty demo section headings (e.g. CERTIFICATIONS, ACHIEVEMENTS, PROJECTS, REFERENCES)
  const headingRx = /^(PROJECTS|CERTIFICATION|CERTIFICATIONS|ACHIEVEMENTS|REFERENCES)$/i
  Array.from(root.querySelectorAll<HTMLElement>('h2, h3, h4, div, span')).forEach((el) => {
    if (!el.isConnected) return
    const txt = (el.textContent ?? '').trim()
    if (headingRx.test(txt) && el.children.length === 0) {
      const sec = el.closest('section') ?? el.parentElement
      if (sec && sec !== root && !sec.querySelector('[data-cv-kind="experience"], [data-cv-kind="education"]')) {
        sec.remove()
      } else {
        el.remove()
      }
    }
  })

  // 5. Replace summary BEFORE jobTitle so "Front-end developer building..." matches cleanly
  const nameParts = (cv.fullName || '').trim().split(/\s+/).filter(Boolean)
  const firstName = nameParts[0] ?? ''
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''

  const textReplacements: Array<[RegExp, string]> = [
    [
      /Front-end developer building accessible, responsive web applications with Vue, Nuxt and TypeScript\. Turns product requirements into reliable interfaces, working closely with designers and backend engineers\./gi,
      cv.summary || '',
    ],
    [
      /Human-centered product designer with 6\+ years crafting fintech and enterprise web applications across Southeast Asia\./gi,
      cv.summary || '',
    ],
    [/NGOYTRY LYHUOR/g, cv.fullName || ''],
    [/Ngoytry Lyhuor/g, cv.fullName || ''],
    [/\bNGOYTRY\b/g, firstName],
    [/\bLYHUOR\b/g, lastName],
    [/Senior UI & Frontend Engineer/gi, cv.jobTitle || ''],
    [/Front-End Developer/gi, cv.jobTitle || ''],
    [/\+855 12 889 412/g, cv.phone || ''],
    [/\+855 XX XXX XXX/g, cv.phone || ''],
    [/ngoytry\.lyhuor@demo-cv\.kh/gi, cv.email || ''],
    [/Phnom Penh\s*[·,]\s*Cambodia/gi, cv.location || ''],
    [/https:\/\/portfolio\.demo-cv\.kh\/ngoytry/gi, ''],
    [/ngoytry-lyhuor/gi, ''],
  ]

  // Map demo skills sequentially to user's skills if available
  const demoSkills = [
    'Vue / Nuxt',
    'JavaScript / TypeScript',
    'HTML / CSS',
    'Responsive UI',
    'Accessibility',
    'Automated testing',
    'Team collaboration',
  ]
  demoSkills.forEach((demoSkill, idx) => {
    const replacement = cv.skills[idx] ?? ''
    textReplacements.push([new RegExp(demoSkill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), replacement])
  })

  if (cv.languages.length > 0) {
    textReplacements.push([/Khmer\s*[·•—-]\s*Native/gi, cv.languages[0] ?? ''])
    textReplacements.push([/English\s*[·•—-]\s*Advanced/gi, cv.languages[1] ?? ''])
  }

  replaceTextNodes(root, textReplacements)

  // 5b. Hide ONLY empty [data-cv-contact] rows (e.g. GitHub/LinkedIn/Website left empty after clearing demo handles).
  // Never hide svg.parentElement directly, because section/contact icon badges wrap <svg> inside a <span> with no text.
  root.querySelectorAll<HTMLElement>('[data-cv-contact]').forEach((contactRow) => {
    if ((contactRow.textContent ?? '').trim() === '' && !contactRow.querySelector('img')) {
      contactRow.style.display = 'none'
    }
  })

  // 6. Hide empty secondary A4 pages (page 2+) if they no longer have CV records
  const pages = Array.from(root.querySelectorAll<HTMLElement>('.cv-page, [data-cv-page]'))
  if (pages.length > 1) {
    pages.slice(1).forEach((p) => {
      if (!p.querySelector('[data-cv-kind]')) {
        p.remove()
      }
    })
  }

  return root.innerHTML
}
