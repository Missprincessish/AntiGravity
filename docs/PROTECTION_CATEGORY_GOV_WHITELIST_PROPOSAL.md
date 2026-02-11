# Protection (Safety & Laws) — 20 Tools with Government-Only Whitelist

**Category:** `protection` — *Safety & Laws*  
**Rule:** Each tool’s `allowedDomains` are **only** legitimate U.S. government domains (`.gov` or official federal/state government sites).

Below are 20 tools and their proposed **government-only** whitelists for your approval.  
`whitelistedPages` can stay `[]` unless you want to lock to specific URLs later.

---

## 1. Talk to a Lawyer (legal-aid)
- **allowedDomains:** `['lsc.gov']`  
- **Notes:** Legal Services Corporation is the federal grantmaker for civil legal aid; site links to local LSC-funded programs.

---

## 2. Stay Safe / Domestic Violence (stay-safe)
- **allowedDomains:** `['ovw.usdoj.gov', 'womenshealth.gov']`  
- **Notes:** OVW = Office on Violence Against Women (DOJ); womenshealth.gov is HHS. Replaces non-gov thehotline.org.

---

## 3. Know Your Rights (know-your-rights)
- **allowedDomains:** `['justice.gov', 'usa.gov']`  
- **Notes:** DOJ and USA.gov for general civil/criminal rights and government info.

---

## 4. Court Info & Locations (court-info)
- **allowedDomains:** `['uscourts.gov', 'usa.gov']`  
- **Notes:** Federal courts and USA.gov for finding federal/state court info.

---

## 5. File a Consumer Complaint (consumer-complaint)
- **allowedDomains:** `['ftc.gov', 'consumer.ftc.gov']`  
- **Notes:** FTC and official consumer pages for scams and complaints.

---

## 6. Workplace Discrimination (workplace-discrimination)
- **allowedDomains:** `['eeoc.gov']`  
- **Notes:** Equal Employment Opportunity Commission (federal).

---

## 7. Immigration & Citizenship (immigration-citizenship)
- **allowedDomains:** `['uscis.gov', 'dhs.gov']`  
- **Notes:** U.S. Citizenship and Immigration Services and DHS.

---

## 8. Victim Compensation & Resources (victim-compensation)
- **allowedDomains:** `['ojp.gov', 'ovc.ojp.gov']`  
- **Notes:** Office of Justice Programs and Office for Victims of Crime.

---

## 9. Someone in Prison / Bureau of Prisons (prison-family)
- **allowedDomains:** `['bop.gov']`  
- **Notes:** Federal Bureau of Prisons (locator, visits, mail).

---

## 10. Voting Rights & Registration (voting-rights)
- **allowedDomains:** `['usa.gov', 'eac.gov']`  
- **Notes:** USA.gov voting hub; EAC = Election Assistance Commission.

---

## 11. Housing Discrimination (housing-discrimination)
- **allowedDomains:** `['hud.gov']`  
- **Notes:** HUD fair housing and complaint info.

---

## 12. Report a Crime (report-crime)
- **allowedDomains:** `['fbi.gov', 'justice.gov']`  
- **Notes:** FBI tips and DOJ for reporting and awareness.

---

## 13. Restraining Orders & Protection Orders (restraining-order)
- **allowedDomains:** `['usa.gov', 'ovw.usdoj.gov']`  
- **Notes:** USA.gov and OVW for protection order info and links to state resources.

---

## 14. Child Support (child-support)
- **allowedDomains:** `['acf.hhs.gov', 'childsupport.gov']`  
- **Notes:** ACF (HHS) and official child support program site.

---

## 15. Elder Abuse & Protection (elder-abuse)
- **allowedDomains:** `['acl.gov', 'ncea.acl.gov']`  
- **Notes:** Administration for Community Living and National Center on Elder Abuse.

---

## 16. Identity Theft (identity-theft)
- **allowedDomains:** `['identitytheft.gov', 'ftc.gov']`  
- **Notes:** FTC’s identitytheft.gov and main FTC site.

---

## 17. Small Claims & Civil Court (small-claims)
- **allowedDomains:** `['uscourts.gov', 'usa.gov']`  
- **Notes:** Federal court info and USA.gov for state small-claims links.

---

## 18. Public Defender & Criminal Defense (public-defender)
- **allowedDomains:** `['justice.gov', 'lsc.gov']`  
- **Notes:** DOJ (federal defender) and LSC (civil legal aid context).

---

## 19. Probation & Parole (probation-parole)
- **allowedDomains:** `['ojp.gov', 'bop.gov']`  
- **Notes:** OJP for reentry/probation resources; BOP for federal supervision.

---

## 20. Civil Rights Complaints (civil-rights)
- **allowedDomains:** `['justice.gov', 'eeoc.gov']`  
- **Notes:** DOJ Civil Rights Division and EEOC (employment).

---

## Summary

| # | Tool ID                 | Allowed domains (government only)                    |
|---|-------------------------|------------------------------------------------------|
| 1 | legal-aid               | lsc.gov                                              |
| 2 | stay-safe               | ovw.usdoj.gov, womenshealth.gov                      |
| 3 | know-your-rights        | justice.gov, usa.gov                                 |
| 4 | court-info              | uscourts.gov, usa.gov                                |
| 5 | consumer-complaint      | ftc.gov, consumer.ftc.gov                             |
| 6 | workplace-discrimination| eeoc.gov                                             |
| 7 | immigration-citizenship | uscis.gov, dhs.gov                                   |
| 8 | victim-compensation     | ojp.gov, ovc.ojp.gov                                 |
| 9 | prison-family           | bop.gov                                              |
|10 | voting-rights           | usa.gov, eac.gov                                     |
|11 | housing-discrimination  | hud.gov                                              |
|12 | report-crime            | fbi.gov, justice.gov                                 |
|13 | restraining-order       | usa.gov, ovw.usdoj.gov                               |
|14 | child-support           | acf.hhs.gov, childsupport.gov                         |
|15 | elder-abuse             | acl.gov, ncea.acl.gov                                |
|16 | identity-theft          | identitytheft.gov, ftc.gov                           |
|17 | small-claims            | uscourts.gov, usa.gov                                |
|18 | public-defender         | justice.gov, lsc.gov                                 |
|19 | probation-parole        | ojp.gov, bop.gov                                     |
|20 | civil-rights            | justice.gov, eeoc.gov                                |

---

Once you approve this list, these can be added to `packages/core/src/registry.ts` as the Protection category agents with the above `allowedDomains` and `whitelistedPages: []`. If you want to swap any domain or add/remove a tool, say which row(s) to change.
