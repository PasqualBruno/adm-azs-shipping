package com.azship.fretes.service;

import com.azship.fretes.dto.CompanyRequest;
import com.azship.fretes.model.Company;
import com.azship.fretes.repository.CompanyRepository;
import com.azship.fretes.repository.ShippingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final ShippingRepository shippingRepository;

    public CompanyService(CompanyRepository companyRepository, ShippingRepository shippingRepository) {
        this.companyRepository = companyRepository;
        this.shippingRepository = shippingRepository;
    }

    public Company createCompany(CompanyRequest request) {
        Company newCompany = new Company();
        newCompany.setName(request.getName());
        newCompany.setImage(request.getImage());
        newCompany.setPeso(Optional.ofNullable(request.getPeso()).orElse(false));
        newCompany.setVolume(Optional.ofNullable(request.getVolume()).orElse(false));
        newCompany.setTipoCarga(Optional.ofNullable(request.getTipoCarga()).orElse(false));
        newCompany.setOrigem(Optional.ofNullable(request.getOrigem()).orElse(false));
        newCompany.setDestino(Optional.ofNullable(request.getDestino()).orElse(false));
        newCompany.setDistancia(Optional.ofNullable(request.getDistancia()).orElse(false));
        return companyRepository.save(newCompany);
    }

    public List<Company> listCompanies(boolean includeArchived) {
        if (includeArchived) {
            return companyRepository.findAll();
        }
        return companyRepository.findAllByArchived(false);
    }

    public Optional<Company> updateCompany(String id, CompanyRequest request) {
        Optional<Company> optionalCompany = companyRepository.findById(id);
        if (optionalCompany.isEmpty()) return Optional.empty();

        Company company = optionalCompany.get();
        company.setName(request.getName());
        company.setImage(request.getImage());
        company.setPeso(Optional.ofNullable(request.getPeso()).orElse(false));
        company.setVolume(Optional.ofNullable(request.getVolume()).orElse(false));
        company.setTipoCarga(Optional.ofNullable(request.getTipoCarga()).orElse(false));
        company.setOrigem(Optional.ofNullable(request.getOrigem()).orElse(false));
        company.setDestino(Optional.ofNullable(request.getDestino()).orElse(false));
        company.setDistancia(Optional.ofNullable(request.getDistancia()).orElse(false));

        return Optional.of(companyRepository.save(company));
    }

    public boolean deleteCompany(String id) {
        if (!companyRepository.existsById(id)) {
            throw new RuntimeException("Empresa com ID " + id + " não encontrada.");
        }

        if (shippingRepository.existsByCompany(id)) {
            throw new RuntimeException("Não é possível excluir esta empresa, pois existem fretes associados a ela.");
        }

        companyRepository.deleteById(id);
        return true;
    }

    public Optional<Company> toggleCompanyArchive(String id) {
        Optional<Company> optionalCompany = companyRepository.findById(id);
        if (optionalCompany.isEmpty()) return Optional.empty();

        Company company = optionalCompany.get();
        company.setArchived(!company.getArchived());
        return Optional.of(companyRepository.save(company));
    }
}