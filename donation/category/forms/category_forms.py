from django import forms
from category.models import Category

class CategoryForm(forms.ModelForm):

		name=forms.CharField(widget=forms.TextInput(attrs={'class':'form-control','required': False}))
		tagline=forms.CharField(widget=forms.TextInput(attrs={'class':'form-control','required': False}))
		descriptions=forms.CharField(widget=forms.Textarea(attrs={'class':'form-control','required': False,'rows': 7}))
		# image=forms.ImageField(attrs={'class':'form-control','required': False})

		class Meta:
			model=Category
			fields=('name','tagline','descriptions','image','cover_image','cover_video')